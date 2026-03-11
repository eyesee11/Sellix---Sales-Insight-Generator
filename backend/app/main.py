import os

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.openapi.docs import get_redoc_html
from fastapi.responses import HTMLResponse
from fastapi.middleware.cors import CORSMiddleware
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded

from app.limiter import limiter
from routers.upload import router

load_dotenv()

app = FastAPI(
    title="Sales Insight Automator",
    description=(
        "## Sales Insight Automator\n\n"
        "Upload a `.csv` or `.xlsx` sales file and a recipient email address. "
        "The API parses the data with **pandas**, generates an executive summary using "
        "**Groq `llama-3.3-70b-versatile`** (replaces the earlier Gemini integration), "
        "and delivers the report to the provided inbox via **Resend** (transactional email API).\n\n"
        "### Live base URL\n"
        "**Production:** `https://sellix-sales-insight-generator.onrender.com`\n\n"
        "**Local dev:** `http://localhost:8000`\n\n"
        "### Authentication\n"
        "No auth required for local/dev use. Set `GROQ_API_KEY` and `RESEND_API_KEY` in `backend/.env`.\n\n"
        "### Rate limit\n"
        "`POST /api/v1/upload` — **5 requests / minute / IP**.\n\n"
        "### LLM provider\n"
        "| Field | Value |\n"
        "|---|---|\n"
        "| Provider | Groq Cloud |\n"
        "| Model | llama-3.3-70b-versatile |\n"
        "| Env var | `GROQ_API_KEY` |\n"
        "| Free tier | 14 400 RPD · 30 RPM |"
    ),
    version="1.1.0",
    contact={
        "name": "Rabbitt AI — Ayush Chauhan",
        "email": "ayushchauhan1164@gmail.com",
    },
    servers=[
        {"url": "https://sellix-sales-insight-generator.onrender.com", "description": "Production (Render)"},
        {"url": "http://localhost:8000", "description": "Local development"},
    ],
    redoc_url=None,
    swagger_ui_parameters={"syntaxHighlight.theme": "obsidian"},
)

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

app.add_middleware(
    CORSMiddleware,
    allow_origins=os.getenv("FRONTEND_URL", "http://localhost:3000").split(","),
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

app.include_router(router)


@app.get("/health", tags=["Health"], summary="Health check")
def health():
    return {"status": "ok"}


@app.get("/redoc", include_in_schema=False, response_class=HTMLResponse)
async def redoc_html():
    return get_redoc_html(
        openapi_url="/openapi.json",
        title="Sales Insight Automator — ReDoc",
        redoc_js_url="https://cdn.jsdelivr.net/npm/redoc@2.1.5/bundles/redoc.standalone.js",
    )
