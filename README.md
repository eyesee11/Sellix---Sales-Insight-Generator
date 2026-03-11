# Sales Insight Automator

Upload a sales CSV or Excel file, get an AI-generated executive summary delivered straight to your inbox. Built for Rabbitt AI's internal sprint.

---

## What it does

1. Drop a `.csv` or `.xlsx` file + type an email
2. Backend parses the data with pandas, feeds aggregates to Gemini
3. Gemini writes a clean narrative summary
4. You get it in your inbox via Gmail

---

## Stack

| Layer | Tech |
|---|---|
| Frontend | Next.js 14 (App Router), TypeScript, Tailwind CSS |
| Backend | FastAPI (Python 3.11) |
| AI | Google Gemini API |
| Email | Gmail SMTP (App Password) |
| Containers | Docker + docker-compose |
| CI/CD | GitHub Actions |

---

## Running locally

### 1. Clone and set up env vars

```bash
git clone <your-repo-url>
cd sellix
cp backend/.env.example backend/.env
# fill in the values (see .env.example below)

### 2. env.example
```
GEMINI_API_KEY=your_gemini_api_key
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_user_name
SMTP_PASSWORD=your_app_password
FRONTEND_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:8000
```