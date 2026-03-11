# Sales Insight Automator

> Upload a `.csv` or `.xlsx` sales file, get an AI-generated executive summary delivered straight to your inbox — powered by **Groq LLaMA 3.3** and **Gmail SMTP**.
> Built for Rabbitt AI's Cloud DevOps Engineering sprint.

---

## Live demo

![Sales Insight Automator — working screenshot](ss/image.png)

_Drop a file, enter an email, hit Analyze — the formatted HTML summary lands in your inbox within seconds._

---

## How it works

```
Browser (Next.js)
    │  multipart/form-data  (file + email)
    ▼
FastAPI  ──► pandas parses CSV/XLSX → computes aggregates
    │
    ▼
Groq Cloud  (llama-3.3-70b-versatile)
    │  returns executive narrative summary
    ▼
Gmail SMTP  (STARTTLS · port 587)
    │  sends branded HTML email
    ▼
Recipient's inbox ✓
```

---

## Stack

| Layer      | Tech                                                                 |
| ---------- | -------------------------------------------------------------------- |
| Frontend   | Next.js 14 (App Router) · TypeScript · Tailwind CSS · react-dropzone |
| Backend    | FastAPI 0.115 · Python 3.11 · uvicorn · pandas · slowapi             |
| LLM        | **Groq Cloud** — `llama-3.3-70b-versatile` (14 400 RPD free tier)    |
| Email      | Gmail SMTP via `aiosmtplib` · STARTTLS port 587 · App Password       |
| Containers | Docker · docker-compose (no `version:` key — Docker 26+)             |
| CI/CD      | GitHub Actions — flake8 · ESLint/tsc · docker-compose build          |

---

## API endpoints

Base URL (local): `http://localhost:8000`

| Method | Path             | Description                                        |
| ------ | ---------------- | -------------------------------------------------- |
| `POST` | `/api/v1/upload` | Upload `.csv`/`.xlsx` + email → AI summary → inbox |
| `GET`  | `/health`        | Health check — returns `{"status": "ok"}`          |
| `GET`  | `/docs`          | Swagger UI (interactive)                           |
| `GET`  | `/redoc`         | ReDoc reference docs                               |

### POST `/api/v1/upload`

| Field   | Type                  | Notes                              |
| ------- | --------------------- | ---------------------------------- |
| `file`  | `multipart/form-data` | `.csv` or `.xlsx`, max 10 MB       |
| `email` | `form field`          | Valid email — summary is sent here |

**Rate limit:** 5 requests / minute / IP

**Response 200:**

```json
{
  "message": "Summary generated and sent to your inbox.",
  "recipient": "you@example.com"
}
```

---

## Running locally

### Prerequisites

| Requirement    | Version | Notes                                             |
| -------------- | ------- | ------------------------------------------------- |
| Docker Desktop | 26+     | Compose V2 built-in (`docker compose`, no hyphen) |
| Node.js        | 20+     | Only needed for local (non-Docker) dev            |
| Python         | 3.11+   | Only needed for local (non-Docker) dev            |

---

### Step 1 — Clone & configure env

```bash
git clone <your-repo-url>
cd sellix
cp backend/.env.example backend/.env
```

Edit `backend/.env` and fill in every value:

```env
GROQ_API_KEY=gsk_...                  # console.groq.com/keys — free account, no card needed
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=you@gmail.com
SMTP_PASSWORD=xxxx xxxx xxxx xxxx    # Gmail App Password — NOT your login password
FRONTEND_URL=http://localhost:3000   # CORS allowlist — change to your deployed URL in prod
NEXT_PUBLIC_API_URL=http://localhost:8000
```

> **Gmail App Password:** Google Account → Security → 2-Step Verification → App Passwords → "Other (custom name)" → copy the 16-char password.

---

### Option A — Full stack via Docker Compose (recommended)

**First run (builds both images from scratch):**

```bash
docker compose up --build
```

**Subsequent runs (uses cached layers — much faster):**

```bash
docker compose up
```

**Run in background (detached):**

```bash
docker compose up -d --build
```

**Stop and remove containers:**

```bash
docker compose down
```

**Stop and also remove volumes/images:**

```bash
docker compose down --volumes --rmi all
```

Once running:

| Service      | URL                          |
| ------------ | ---------------------------- |
| Frontend     | http://localhost:3000        |
| Backend API  | http://localhost:8000        |
| Swagger UI   | http://localhost:8000/docs   |
| ReDoc        | http://localhost:8000/redoc  |
| Health check | http://localhost:8000/health |

---

### Option B — Build & run each image individually

Useful when you want to iterate on one service without touching the other.

#### Backend

```bash
# Build
docker build -t sellix-backend ./backend

# Run (pass the .env file directly)
docker run --rm \
  --env-file ./backend/.env \
  -p 8000:8000 \
  --name sellix-backend \
  sellix-backend
```

#### Frontend

The Next.js image bakes `NEXT_PUBLIC_API_URL` at **build time** (it gets embedded into the JS bundle), so pass it as a build arg:

```bash
# Build — point at your running backend
docker build \
  --build-arg NEXT_PUBLIC_API_URL=http://localhost:8000 \
  -t sellix-frontend \
  ./frontend

# Run
docker run --rm \
  -p 3000:3000 \
  --name sellix-frontend \
  sellix-frontend
```

> If you're deploying the frontend against a remote backend (e.g. Render), replace `http://localhost:8000` with the Render service URL at build time.

---

### Viewing logs

```bash
# Tail both services at once
docker compose logs -f

# Tail backend only
docker compose logs -f backend

# Tail frontend only
docker compose logs -f frontend

# Individual container (Option B)
docker logs -f sellix-backend
```

---

### Useful Docker commands

```bash
# See running containers and their ports
docker ps

# Restart a single service without rebuilding
docker compose restart backend

# Rebuild a single service after code changes
docker compose up -d --build backend

# Open a shell inside the backend container
docker exec -it sellix-backend-1 sh

# Check image sizes
docker images | grep sellix
```

---

### Option C — Local dev (no Docker)

**Backend:**

```bash
cd backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

**Frontend (separate terminal):**

```bash
cd frontend
npm install
npm run dev    # → http://localhost:3000
```

---

## Project structure

```
sellix/
├── backend/
│   ├── app/
│   │   ├── main.py          # FastAPI app, CORS, rate limiter, ReDoc
│   │   ├── ai_service.py    # Groq LLaMA call — builds prompt, returns summary
│   │   ├── email_service.py # aiosmtplib async Gmail sender
│   │   ├── file_parser.py   # pandas CSV/XLSX parser → aggregates dict
│   │   └── limiter.py       # shared slowapi Limiter instance
│   ├── routers/
│   │   └── upload.py        # POST /api/v1/upload — validate → parse → AI → email
│   ├── schemas.py           # Pydantic response models
│   ├── requirements.txt
│   ├── Dockerfile
│   └── .env.example
├── frontend/
│   ├── app/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── UploadForm.tsx        # Drag-drop UI, 4 states (idle/loading/success/error)
│   ├── lib/api.ts            # uploadFile() → POST multipart FormData
│   ├── next.config.mjs
│   ├── tailwind.config.ts
│   └── Dockerfile
├── ss/
│   └── image.png            # working screenshot
├── sales_q1_2026.csv        # sample test file
├── docker-compose.yml
└── .github/workflows/ci.yml
```

---

## CI/CD

GitHub Actions runs on every PR → `main`:

| Job             | What it checks                                          |
| --------------- | ------------------------------------------------------- |
| `lint-backend`  | `flake8` on `backend/`                                  |
| `lint-frontend` | `eslint` + `tsc --noEmit` on `frontend/`                |
| `build-docker`  | `docker compose build` — both images must build cleanly |

---

## Security implementation

Below is every security control in this project, what it guards against, and exactly where it lives in the code.

---

### 1. CORS — strict origin whitelist

**What it prevents:** Cross-origin requests from arbitrary domains (e.g. a malicious site calling your API and impersonating your frontend).

**How it's implemented** (`backend/app/main.py`):

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.getenv("FRONTEND_URL", "http://localhost:3000")],
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)
```

`allow_origins` is **never** `"*"`. It is read from the `FRONTEND_URL` env var — only one domain is permitted. In production, set `FRONTEND_URL` to your exact Vercel/deployment URL.

---

### 2. Rate limiting — 5 requests / minute / IP

**What it prevents:** Abuse, API quota exhaustion, and denial-of-service via the upload endpoint.

**How it's implemented** (`backend/app/limiter.py` + `backend/routers/upload.py`):

```python
# limiter.py
from slowapi import Limiter
from slowapi.util import get_remote_address
limiter = Limiter(key_func=get_remote_address)

# upload.py
@limiter.limit("5/minute")
async def upload_sales_file(request: Request, ...):
```

`slowapi` wraps the route with an IP-keyed token bucket. Exceeding the limit returns **HTTP 429** automatically.

---

### 3. File validation — extension AND MIME type

**What it prevents:** Uploading arbitrary files (executables, scripts, HTML) disguised as spreadsheets; path traversal; processing unexpected binary formats.

**How it's implemented** (`backend/routers/upload.py`):

```python
ALLOWED_EXTENSIONS = {".csv", ".xlsx"}
ALLOWED_MIME_TYPES = {
    "text/csv",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.ms-excel",
    "application/octet-stream",   # some browsers send this for .csv
}
MAX_SIZE_BYTES = 10 * 1024 * 1024   # 10 MB

ext = os.path.splitext(file.filename or "")[1].lower()
if ext not in ALLOWED_EXTENSIONS:      # HTTP 422 if wrong ext
    raise HTTPException(status_code=422, ...)
if file.content_type not in ALLOWED_MIME_TYPES:  # HTTP 422 if wrong MIME
    raise HTTPException(status_code=422, ...)
if len(content) > MAX_SIZE_BYTES:      # HTTP 413 if too large
    raise HTTPException(status_code=413, ...)
```

Both the filename extension **and** the browser-reported MIME type must match an allowlist. File size is hard-capped after reading the raw bytes (not trusting the `Content-Length` header).

---

### 4. Email validation — Pydantic `EmailStr`

**What it prevents:** Garbage strings, injection attempts, or typos being passed to the SMTP sender.

**How it's implemented** (`backend/routers/upload.py`):

```python
from pydantic import EmailStr

async def upload_sales_file(
    ...,
    email: EmailStr = Form(...),
):
```

FastAPI/Pydantic validates the email field against RFC 5322 before the handler even runs. Invalid addresses return **HTTP 422** automatically.

---

### 5. Non-root Docker user

**What it prevents:** Container breakout privilege escalation — if the app process is compromised, it cannot write to the host filesystem or execute privileged syscalls.

**How it's implemented** (`backend/Dockerfile`):

```dockerfile
RUN adduser --disabled-password --gecos "" appuser
USER appuser
```

The backend runs as `appuser` (UID > 1000), not `root`.

---

### 6. Secrets never committed — `.gitignore`

**What it prevents:** API keys and SMTP credentials leaking into the git history / GitHub.

**How it's implemented** (`.gitignore`):

```
backend/.env
```

`backend/.env` (which contains `GROQ_API_KEY`, `SMTP_PASSWORD`, etc.) is excluded from git. Only `backend/.env.example` (with placeholder values) is committed.

> **Lesson learned the hard way:** An earlier iteration accidentally committed the `.env` file. Recovery required `git rm --cached backend/.env` + `git commit --amend` + `git push --force`. Google auto-revoked the leaked Gemini key within minutes. Don't commit secrets.

---

### 7. Gmail App Password — not your account password

**What it prevents:** Your primary Google account credentials being exposed in the env file. App Passwords are scoped, revocable, and do not grant access to the full account.

**How it's implemented** (`backend/app/email_service.py`):

```python
await smtp.login(os.environ["SMTP_USER"], os.environ["SMTP_PASSWORD"])
```

`SMTP_PASSWORD` should be the 16-character App Password from Google Account → Security → App Passwords — never your login password.

---

### 8. STARTTLS — encrypted SMTP transport

**What it prevents:** Email credentials and content being transmitted in plaintext over the network.

**How it's implemented** (`backend/app/email_service.py`):

```python
async with aiosmtplib.SMTP(
    hostname=os.environ["SMTP_HOST"],
    port=int(os.environ["SMTP_PORT"]),   # 587
    start_tls=True,
) as smtp:
```

Port 587 with `start_tls=True` upgrades the connection to TLS before any credentials are sent. Port 25 (plaintext) and port 465 (implicit SSL) are not used.

---

### Security summary

| Control                | Protects against                  | HTTP response if violated |
| ---------------------- | --------------------------------- | ------------------------- |
| CORS whitelist         | Cross-origin API abuse            | 403                       |
| Rate limit 5/min/IP    | DoS / quota exhaustion            | 429                       |
| Extension + MIME check | Malicious file uploads            | 422                       |
| File size cap 10 MB    | Memory exhaustion                 | 413                       |
| Pydantic `EmailStr`    | Bad/injected email input          | 422                       |
| Non-root Docker user   | Container privilege escalation    | —                         |
| `.env` in `.gitignore` | Secret leakage to git             | —                         |
| Gmail App Password     | Full account credential exposure  | —                         |
| SMTP STARTTLS port 587 | Plaintext credential transmission | —                         |
