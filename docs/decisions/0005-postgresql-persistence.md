# ADR 0005: PostgreSQL persistence foundation

- Status: Accepted
- Date: 2026-07-21

## Context

Phase 1.1 needs persistent storage, controlled schema evolution, reusable transaction boundaries, and
integration tests that cannot accidentally modify the development database. No domain table is due
until the authentication phase.

## Decision

- Use SQLAlchemy 2.x with the Psycopg 3 driver and synchronous sessions. FastAPI endpoints can keep
  database work in short, explicit transaction boundaries; background work can use the same helpers.
- Use a naming convention on shared SQLAlchemy metadata so future constraints have stable names.
- Use Alembic for schema migrations, beginning with a reversible no-domain-table baseline. Phase 1.2
  will add the first domain table rather than introducing a placeholder table.
- Initialize a separate PostgreSQL database for integration tests. Migration tests require its name
  to end in `_test` and reject the configured application database name.
- Supply database URLs exclusively through environment-backed settings. Pydantic stores the URL as
  a secret so settings representations do not disclose credentials.

## Consequences

- Local development now requires applying Alembic migrations before persistent endpoints are added.
- A PostgreSQL volume created before this phase does not rerun initialization scripts; that setup
  needs a one-time test-database creation or a disposable-volume recreation.
- The initial migration only establishes Alembic's version history. Authentication owns the first
  application table in Phase 1.2.
- Synchronous database calls must remain bounded; an async database stack can be reconsidered only
  if measured request concurrency shows it is necessary.
