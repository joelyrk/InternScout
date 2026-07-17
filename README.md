# InternScout

InternScout is an AI-assisted internship discovery and application copilot for computer science students in Singapore. It is a candidate-facing productivity tool: users review and submit applications themselves, and generated application content must be grounded in verified user-provided evidence.

The repository has completed **Phase 0.3: backend skeleton**. The Next.js frontend and FastAPI backend are independently runnable; typed communication between them arrives in Phase 0.4.

## Repository layout

```text
apps/
  api/                  FastAPI service
  web/                  Next.js application
packages/
  config/               Shared tooling configuration
  shared-types/         Shared or generated API schemas
  ui/                   Shared frontend components
workers/
  ingestion/            Job ingestion workers
  matching/             Match calculation workers
  notifications/        Notification workers
docs/
  decisions/            Architecture decision records
scripts/                Development and validation scripts
tests/                  Cross-project tests
```

## Prerequisites

- Node.js 24 or newer
- npm 11 or newer
- Python 3.12 or newer
- uv 0.11
- Docker with Docker Compose

## Local setup

1. Install workspace dependencies:

   ```bash
   npm install
   uv sync --project apps/api --locked
   ```

2. Create a local environment file and replace the development-only database password if needed:

   ```bash
   cp .env.example .env
   ```

3. Start the local infrastructure placeholders:

   ```bash
   docker compose up -d
   ```

4. Start the applications in separate terminals:

   ```bash
   npm run dev
   uv run --project apps/api uvicorn internscout_api.main:app \
     --reload \
     --env-file .env \
     --host 127.0.0.1 \
     --port 8000
   ```

   Open `http://localhost:3000` for the frontend and `http://localhost:8000/docs` for API documentation. PostgreSQL and Redis are not yet used by either application, so Docker remains optional.

5. Verify the repository:

   ```bash
   npm run verify
   npm run format:check
   npm run lint
   npm run typecheck
   npm test
   npm run build
   docker compose --env-file .env.example config --quiet
   cd apps/api
   uv lock --check
   uv run ruff check .
   uv run black --check .
   uv run pyright
   uv run pytest --cov=internscout_api --cov-report=term-missing
   ```

6. Stop local infrastructure when finished:

   ```bash
   docker compose down
   ```

Follow [BUILD_PLAN.md](BUILD_PLAN.md) for the sequential implementation phases and [AGENTS.md](AGENTS.md) for product, safety, privacy, and engineering requirements.

## Security and privacy

- Never commit `.env` files, access tokens, resumes, contact details, or real candidate fixtures.
- Do not automate application submission or access job sources without a documented permitted method.
- Keep every generated resume claim traceable to verified evidence and require human approval before export.
