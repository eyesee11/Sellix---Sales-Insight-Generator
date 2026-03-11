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
    tags=["Upload"],
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
            subject="Sales Executive Summary — Rabbitt AI",
            summary=summary,
        )
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Processing failed: {exc}")

    return UploadResponse(
        message="Summary generated and sent to your inbox.",
        recipient=str(email),
    )
