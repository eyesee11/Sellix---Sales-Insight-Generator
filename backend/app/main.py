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
    description="Upload a sales CSV/XLSX and get an AI-generated executive summary sent to your inbox.",
    version="1.0.0",
    redoc_url=None,
    swagger_ui_parameters={"syntaxHighlight.theme": "obsidian"},
)

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.getenv("FRONTEND_URL", "http://localhost:3000")],
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
