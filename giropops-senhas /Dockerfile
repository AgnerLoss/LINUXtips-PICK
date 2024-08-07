# Stage 1: Build
FROM cgr.dev/chainguard/python:latest-dev as builder
WORKDIR /app
COPY requirements.txt .
RUN python3 -m venv /app/venv && \
    /app/venv/bin/pip install --no-cache-dir -r requirements.txt
COPY . .

# Stage 2: Run
FROM cgr.dev/chainguard/python:latest
WORKDIR /app
COPY --from=builder /app/venv/lib/python3.12/site-packages /app/venv/lib/python3.12/site-packages
COPY --from=builder /app/venv /app/venv
COPY --from=builder /app/requirements.txt /app/
COPY --from=builder /app/templates /app/templates
COPY --from=builder /app/static /app/static
COPY --from=builder /app/app.py /app/
ENV PATH="/app/venv/bin:$PATH"
EXPOSE 5000
ENTRYPOINT [ "flask", "run", "--host=0.0.0.0" ]













