# InternScout API

The FastAPI backend for InternScout.

## Setup

From the repository root:

```bash
uv sync --project apps/api --locked
```

Copy `.env.example` to `.env` if you have not already done so. The API reads settings with the `INTERNSCOUT_` prefix.

`INTERNSCOUT_CORS_ORIGINS` is a JSON array of exact frontend origins. Local defaults allow
`http://localhost:3000` and `http://127.0.0.1:3000`; deployment environments must replace these
with their own frontend origins.

## Run locally

```bash
uv run --project apps/api uvicorn internscout_api.main:app \
  --reload \
  --env-file .env \
  --host 127.0.0.1 \
  --port 8000
```

The service exposes:

- `GET /health` for process health
- `GET /ready` for readiness
- `/docs` for interactive API documentation outside production

## Validate

Run checks from `apps/api`:

```bash
uv lock --check
uv run ruff check .
uv run black --check .
uv run pyright
uv run pytest --cov=internscout_api --cov-report=term-missing
```
