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

### 1. Clone & configure env

```bash
git clone <your-repo-url>
cd sellix
cp backend/.env.example backend/.env
# edit backend/.env — fill in the values below
```

### 2. `backend/.env` values

```env
GROQ_API_KEY=gsk_...          # from console.groq.com/keys (free)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=you@gmail.com
SMTP_PASSWORD=xxxx xxxx xxxx xxxx   # Gmail App Password (not your login password)
FRONTEND_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:8000
```

> **Gmail App Password:** Google Account → Security → 2-Step Verification → App Passwords → generate one for "Mail".

### 3a. Docker (recommended)

```bash
docker compose up --build
```

- Frontend → `http://localhost:3000`
- Backend → `http://localhost:8000`
- Swagger → `http://localhost:8000/docs`

### 3b. Local (without Docker)

**Backend:**

```bash
cd backend
python -m venv venv && source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

**Frontend:**

```bash
cd frontend
npm install
npm run dev        # → http://localhost:3000
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

## Security notes

- `backend/.env` is in `.gitignore` — **never committed**
- CORS origin is locked to `FRONTEND_URL` env var (never `"*"`)
- File uploads are validated by both extension and MIME type
- Rate limiting prevents abuse on the upload endpoint (5 req/min/IP)
- Gmail uses an App Password, not your account password
