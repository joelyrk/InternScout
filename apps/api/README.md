# InternScout API

The FastAPI backend for InternScout.

## Setup

From the repository root:

```bash
uv sync --project apps/api --locked
```

Copy `.env.example` to `.env` if you have not already done so. The API reads settings with the `INTERNSCOUT_` prefix.

`INTERNSCOUT_DATABASE_URL` must be a SQLAlchemy PostgreSQL URL using the `postgresql+psycopg`
driver. Keep credentials in the uncommitted root `.env`; settings mask the URL in diagnostic output.

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

## Database and migrations

Start PostgreSQL from the repository root, then apply the schema:

```bash
docker compose up -d postgres
uv run --project apps/api alembic -c apps/api/alembic.ini upgrade head
```

Roll back the most recent migration with:

```bash
uv run --project apps/api alembic -c apps/api/alembic.ini downgrade -1
```

Compose initializes a separate `internscout_test` database on a new PostgreSQL volume. Integration
tests require `INTERNSCOUT_TEST_DATABASE_URL`, refuse database names without the `_test` suffix, and
refuse to use the configured application database. If PostgreSQL was initialized before Phase 1.1,
create the test database once or recreate the local development volume if its data is disposable.

## Validate

Run checks from `apps/api`:

```bash
uv lock --check
uv run ruff check .
uv run black --check .
uv run pyright
uv run pytest --cov=internscout_api --cov-report=term-missing
```
