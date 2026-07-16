# InternScout

InternScout is an AI-assisted internship discovery and application copilot for computer science students in Singapore. It is a candidate-facing productivity tool: users review and submit applications themselves, and generated application content must be grounded in verified user-provided evidence.

The repository is currently at **Phase 0.1: monorepo foundation**. The frontend and backend directories are placeholders; their runnable applications are introduced in Phases 0.2 and 0.3.

## Repository layout

```text
apps/
  api/                  FastAPI service (Phase 0.3)
  web/                  Next.js application (Phase 0.2)
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
- Docker with Docker Compose

Python 3.12+ will be required when the API is introduced in Phase 0.3.

## Local setup

1. Install workspace dependencies:

   ```bash
   npm install
   ```

2. Create a local environment file and replace the development-only database password if needed:

   ```bash
   cp .env.example .env
   ```

3. Start the local infrastructure placeholders:

   ```bash
   docker compose up -d
   ```

4. Verify the repository foundation:

   ```bash
   npm run verify
   npm test
   docker compose --env-file .env.example config --quiet
   ```

5. Stop local infrastructure when finished:

   ```bash
   docker compose down
   ```

No application server exists in Phase 0.1. Follow [BUILD_PLAN.md](BUILD_PLAN.md) for the sequential implementation phases and [AGENTS.md](AGENTS.md) for product, safety, privacy, and engineering requirements.

## Security and privacy

- Never commit `.env` files, access tokens, resumes, contact details, or real candidate fixtures.
- Do not automate application submission or access job sources without a documented permitted method.
- Keep every generated resume claim traceable to verified evidence and require human approval before export.

