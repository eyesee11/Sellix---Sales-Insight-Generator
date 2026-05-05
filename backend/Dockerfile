FROM python:3.11-slim

WORKDIR /backend

# deps layer first so it's cached unless requirements.txt changes
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# run as root so Render Secret Files (.env) can be read
# RUN adduser --disabled-password --gecos "" appuser
# USER appuser

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
