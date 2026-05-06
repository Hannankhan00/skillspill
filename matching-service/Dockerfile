FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Pre-download the sentence-transformers model at build time so the
# Space starts instantly without downloading ~80 MB on first request.
RUN python -c "from sentence_transformers import SentenceTransformer; SentenceTransformer('all-MiniLM-L6-v2')"

COPY . .

EXPOSE 7860

ENV PORT=7860
ENV PYTHONUNBUFFERED=1

CMD ["python", "app.py"]
