import os

from fastapi import APIRouter, File, Form, HTTPException, Request, UploadFile
from pydantic import EmailStr

from app.ai_service import generate_summary
from app.email_service import send_email
from app.file_parser import parse_file
from app.limiter import limiter
from schemas import UploadResponse

ALLOWED_EXTENSIONS = {".csv", ".xlsx"}
ALLOWED_MIME_TYPES = {
    "text/csv",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.ms-excel",
    "application/octet-stream",  # some browsers send this for .csv
}
MAX_SIZE_BYTES = 10 * 1024 * 1024  # 10 MB

router = APIRouter()


@router.post(
    "/api/v1/upload",
    response_model=UploadResponse,
    summary="Upload sales data and trigger an AI summary email",
    description=(
        "Accepts a `.csv` or `.xlsx` sales file (max **10 MB**) and a recipient email address.\n\n"
        "**Pipeline:**\n"
        "1. Validates file extension and MIME type\n"
        "2. Parses data with pandas → computes revenue/unit/region/category aggregates\n"
        "3. Sends aggregates to **Groq `llama-3.3-70b-versatile`** for an executive summary\n"
        "4. Emails the formatted HTML report via **Brevo** transactional email API\n\n"
        "**Rate limit:** 5 requests / minute / IP\n\n"
        "**Accepted MIME types:** `text/csv`, `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`, "
        "`application/vnd.ms-excel`, `application/octet-stream`"
    ),
    tags=["Upload"],
    responses={
        200: {"description": "Summary generated and email delivered successfully."},
        413: {"description": "File exceeds the 10 MB size limit."},
        422: {"description": "Unsupported file type or invalid email address."},
        429: {"description": "Rate limit exceeded — max 5 requests per minute per IP."},
        500: {"description": "Internal error during parsing, LLM call, or email delivery."},
    },
)
@limiter.limit("5/minute")
async def upload_sales_file(
    request: Request,
    file: UploadFile = File(..., description="Sales data file (.csv or .xlsx, max 10 MB)"),
    email: EmailStr = Form(..., description="Recipient email for the summary"),
):
    # --- validate file type ---
    ext = os.path.splitext(file.filename or "")[1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(status_code=422, detail="Only .csv and .xlsx files are accepted.")

    if file.content_type not in ALLOWED_MIME_TYPES:
        raise HTTPException(status_code=422, detail="Invalid file MIME type.")

    # --- validate size ---
    content = await file.read()
    if len(content) > MAX_SIZE_BYTES:
        raise HTTPException(status_code=413, detail="File exceeds the 10 MB limit.")

    try:
        stats = parse_file(content, file.filename or "upload")
        summary = generate_summary(stats)
        await send_email(
            to=str(email),
            subject="Sales Executive Summary",
            summary=summary,
        )
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Processing failed: {exc}")

    return UploadResponse(
        message="Summary generated and sent to your inbox.",
        recipient=str(email),
    )
