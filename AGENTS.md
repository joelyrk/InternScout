# AGENTS.md

## Project Overview

This repository contains an AI-assisted internship discovery and application copilot for computer science students in Singapore.

The product helps a user:

1. Discover internships from permitted sources.
2. Normalize and deduplicate job listings.
3. Rank internships against the user's profile.
4. Notify the user when strong matches appear.
5. Tailor a resume to a specific job using only verified user-provided evidence.
6. Track applications through a simple pipeline.

This is a candidate-facing productivity tool. It is not an automated mass-application bot.

---

## Primary Product Principles

All agents working in this repository must follow these principles.

### 1. Human approval is required

Do not automatically submit applications, accept legal terms, send messages to employers, or publish resumes.

The user must review and approve:

- Resume changes
- Cover letters
- Application answers
- Outbound messages
- Final application submissions

### 2. Never fabricate candidate information

Generated content must not invent:

- Employers
- Projects
- Technologies
- Metrics
- Awards
- Leadership experience
- Dates
- Academic results
- Responsibilities
- Outcomes

Every generated resume bullet or application claim must be traceable to a stored evidence item.

When evidence is missing, report a gap rather than filling it with a plausible claim.

### 3. Do not build prohibited scraping or automation

Do not implement scraping or browser automation against a service unless its terms, robots policy, API rules, and authentication requirements permit it.

Prefer sources in this order:

1. Official APIs
2. Official feeds
3. Public company career pages with permitted access
4. User-authorized email alerts
5. User-submitted URLs
6. Manual entry

Do not build automated application submission against LinkedIn, Indeed, university portals, or applicant tracking systems unless an official API and explicit authorization exist.

### 4. Privacy by default

Treat resumes, contact details, education history, employment history, application data, and work authorization as sensitive personal data.

Agents must:

- Minimize collected data
- Avoid logging full resume contents
- Avoid logging access tokens or secrets
- Redact unnecessary personal identifiers before model calls
- Encrypt sensitive data at rest where supported
- Use expiring signed URLs for private files
- Provide account and data deletion paths
- Keep test fixtures free of real personal information

### 5. Explain recommendations

Every job score must include a user-readable explanation.

The system should distinguish:

- Strong matches
- Partial matches
- Missing requirements
- Eligibility conflicts
- Unknown information

Do not present probabilistic model output as fact.

---

## Assumed Technical Architecture

Unless an existing implementation establishes otherwise, use the following stack.

### Frontend

- Next.js
- TypeScript
- React
- Tailwind CSS
- Server Components where appropriate
- Accessible semantic HTML
- A lightweight component library only when it reduces maintenance

### Backend

- Python 3.12+
- FastAPI
- Pydantic
- SQLAlchemy
- Alembic
- Background jobs using Celery, Dramatiq, RQ, or an equivalent queue

### Data

- PostgreSQL
- Redis for queues, caching, rate limits, and distributed locks
- S3-compatible object storage for resume exports
- `pgvector` only if semantic retrieval is required

### Infrastructure

- Docker for local development
- GitHub Actions for CI
- Vercel or equivalent for the frontend
- A managed Python host for the API and worker
- Supabase, Neon, RDS, or equivalent for PostgreSQL

Do not introduce additional infrastructure without a clear product or reliability need.

---

## Repository Structure

Prefer the following monorepo structure:

```text
.
├── apps/
│   ├── web/                 # Next.js frontend
│   └── api/                 # FastAPI application
├── packages/
│   ├── shared-types/        # Shared schemas or generated API types
│   ├── ui/                  # Shared UI components
│   └── config/              # Shared lint and TypeScript config
├── workers/
│   ├── ingestion/           # Job source ingestion
│   ├── matching/            # Job scoring and explanations
│   └── notifications/       # Email, Telegram, or other alerts
├── migrations/
├── scripts/
├── tests/
├── docs/
├── docker-compose.yml
└── AGENTS.md
```

If the repository already uses another coherent structure, preserve it unless the task explicitly requires restructuring.

---

## Core Domain Model

The main entities are:

### UserProfile

Contains structured candidate preferences and eligibility information.

Suggested fields:

- Degree
- University
- Graduation year
- Skills
- Role interests
- Preferred locations
- Availability dates
- Internship duration constraints
- Work authorization
- Notification preferences

### EvidenceItem

A verified fact that may be used in generated application materials.

Suggested fields:

- `id`
- `user_id`
- `category`
- `source_name`
- `fact`
- `technologies`
- `metrics`
- `date_range`
- `verified`
- `created_at`
- `updated_at`

### Job

A normalized internship listing.

Suggested fields:

- `id`
- `source`
- `external_id`
- `company`
- `title`
- `location`
- `description`
- `application_url`
- `posted_at`
- `closing_at`
- `first_seen_at`
- `last_seen_at`
- `status`
- `content_hash`

### JobSourceRecord

Stores source-specific metadata for a canonical job.

Suggested fields:

- `job_id`
- `source`
- `external_id`
- `source_url`
- `raw_payload`
- `retrieved_at`

### JobMatch

Stores a user's score and explanation for a job.

Suggested fields:

- `user_id`
- `job_id`
- `score`
- `score_components`
- `strengths`
- `gaps`
- `eligibility_notes`
- `notified_at`

### ResumeVersion

A versioned resume associated with an optional job.

Suggested fields:

- `id`
- `user_id`
- `job_id`
- `content`
- `evidence_map`
- `model_metadata`
- `status`
- `created_at`

### Application

Tracks application progress.

Suggested statuses:

- `discovered`
- `saved`
- `preparing`
- `applied`
- `interviewing`
- `offer`
- `rejected`
- `withdrawn`
- `closed`

---

## Job Ingestion Rules

Each job source must implement a common interface.

Example:

```python
from typing import Protocol

class JobSource(Protocol):
    name: str

    async def fetch_jobs(self) -> list["RawJob"]:
        ...
```

Each connector must document:

- Source owner
- Access method
- Authentication method
- Rate limit
- Terms or policy review date
- Fields collected
- Retention behavior
- Failure behavior
- Test strategy

### Required ingestion behavior

Every connector must:

- Set a descriptive user agent where appropriate
- Respect rate limits
- Use retries with exponential backoff
- Use timeouts
- Validate response schemas
- Avoid duplicate processing
- Store retrieval timestamps
- Fail independently from other connectors
- Emit structured logs without sensitive content

### Source safety

Do not add a new source connector until the implementation includes a short compliance note in `docs/sources/<source-name>.md`.

That note should state why the access method is permitted.

---

## Deduplication

Use layered deduplication.

### Exact duplicate detection

Compare:

- Source and external ID
- Canonical application URL
- Content hash
- Normalized company, title, and location

### Fuzzy duplicate detection

Use fuzzy matching only after exact matching.

Suggested conditions:

- Same normalized company
- Similar normalized title
- Similar location
- High description similarity

Do not merge records automatically when confidence is below a clearly documented threshold.

Preserve all source URLs when several records map to the same canonical job.

---

## Matching and Ranking

Use deterministic logic wherever possible.

The initial score may combine:

- Semantic profile similarity
- Required skill overlap
- Preferred role match
- Date compatibility
- Eligibility compatibility
- Location match
- Listing freshness

Example weighting:

```text
30% semantic similarity
25% skill overlap
15% role interest
10% date compatibility
10% eligibility
5% location
5% recency
```

Weights must be configurable.

### Hard filters

Apply hard filters before ranking where the data is reliable.

Examples:

- Listing is closed
- Internship dates are incompatible
- Required graduation year is incompatible
- Location is excluded
- Work authorization requirement is incompatible

Do not hard-filter on missing or ambiguous data. Mark it as unknown.

### Match explanations

Each match response should include:

```json
{
  "score": 86,
  "strengths": [
    "Python experience",
    "Backend role preference",
    "Availability aligns"
  ],
  "gaps": [
    "No verified AWS experience"
  ],
  "unknowns": [
    "Closing date not provided"
  ]
}
```

All explanations must be based on structured inputs, not unsupported model speculation.

---

## Resume Tailoring Pipeline

Resume tailoring must be evidence-grounded.

### Required stages

1. Parse the job description.
2. Extract requirements and keywords.
3. Retrieve relevant verified evidence.
4. Select the most relevant existing experiences.
5. Rewrite bullets without changing factual meaning.
6. Validate every claim.
7. Present a diff for user approval.
8. Save a new resume version.
9. Export only after approval.

### Job requirement schema

Prefer structured output:

```json
{
  "must_have": [],
  "nice_to_have": [],
  "responsibilities": [],
  "keywords": [],
  "eligibility": []
}
```

### Generated bullet schema

Each generated bullet must include evidence references.

```json
{
  "text": "Developed 12 FastAPI endpoints backed by PostgreSQL.",
  "evidence_ids": ["evidence_123", "evidence_456"],
  "changes": [
    "Prioritized backend implementation",
    "Added verified endpoint count"
  ]
}
```

### Validation requirements

Reject or flag a generated bullet when:

- A technology is not supported by evidence
- A number is not supported by evidence
- A date changes
- An employer or project name changes
- Scope or ownership is exaggerated
- A team result is rewritten as an individual result
- A course project is presented as professional employment

Use deterministic validators before optional model-based review.

---

## LLM Usage Rules

LLMs may be used for:

- Requirement extraction
- Semantic categorization
- Bullet rewriting
- Match explanation drafting
- Summarizing job descriptions

LLMs must not be the sole authority for:

- Eligibility decisions
- Closing dates
- Work authorization
- Numerical claims
- Candidate history
- Whether an application was submitted
- Whether a job is still open

### Prompt requirements

Prompts must clearly state:

- The model must use only supplied evidence
- Unknown information must remain unknown
- No claims may be invented
- Structured output must match a schema
- The model must cite evidence IDs

### Model output handling

All model output is untrusted input.

Agents must:

- Validate JSON
- Enforce schemas
- Escape rendered content
- Apply length limits
- Reject unexpected fields when practical
- Avoid directly executing generated code or SQL
- Store model and prompt versions for reproducibility

### Cost control

Use the smallest suitable model.

Prefer:

- Deterministic parsing before LLM calls
- Cached job analysis
- Batch processing
- Embeddings for retrieval
- Reusing extracted requirements across users
- Token and cost telemetry without logging sensitive text

---

## Notifications

Support:

- Immediate alerts for exceptional matches
- Daily digests
- Quiet hours
- Minimum score thresholds
- Company blocklists
- Keyword exclusions
- Notification history

A notification must not be sent more than once for the same user and canonical job unless the listing materially changes.

Use an idempotency key such as:

```text
user_id + job_id + notification_type + job_version
```

Notifications should explain why the job matched.

---

## API Design

Prefer REST endpoints with explicit schemas.

Suggested endpoints:

```text
POST   /profile
GET    /profile
PATCH  /profile

POST   /evidence
GET    /evidence
PATCH  /evidence/{id}
DELETE /evidence/{id}

GET    /jobs
GET    /jobs/{id}
POST   /jobs/manual
POST   /jobs/{id}/save
POST   /jobs/{id}/ignore

POST   /jobs/{id}/match
POST   /jobs/{id}/tailor-resume

GET    /resume-versions
GET    /resume-versions/{id}
PATCH  /resume-versions/{id}
POST   /resume-versions/{id}/approve
POST   /resume-versions/{id}/export

GET    /applications
POST   /applications
PATCH  /applications/{id}

GET    /notification-preferences
PATCH  /notification-preferences
```

Internal endpoints must not be exposed without service authentication.

---

## Authentication and Authorization

Every user-owned entity must be scoped by authenticated user ID.

Never trust a client-provided user ID.

Authorization checks must happen in the backend for every read and write.

Use:

- Secure HTTP-only cookies or validated bearer tokens
- CSRF protection where relevant
- Short-lived signed file URLs
- Separate service credentials for workers
- Secret rotation support

Do not expose database admin keys to the frontend.

---

## Database Conventions

Use:

- UUID primary keys
- UTC timestamps
- Explicit foreign keys
- Unique constraints for idempotency
- Transactions for multi-step writes
- Database migrations for every schema change
- JSONB only for genuinely flexible structures

Avoid storing core searchable fields exclusively inside JSON.

Every migration should be reversible when practical.

---

## Error Handling

Return stable, documented error responses.

Example:

```json
{
  "error": {
    "code": "UNSUPPORTED_RESUME_CLAIM",
    "message": "The generated bullet includes an unsupported metric.",
    "details": {
      "field": "bullet",
      "claim": "reduced latency by 40%"
    }
  }
}
```

Do not leak:

- Stack traces
- Secrets
- Internal file paths
- Raw database errors
- Model provider credentials

---

## Testing Requirements

Every non-trivial feature should include tests.

### Unit tests

Cover:

- Normalization
- Deduplication
- Scoring
- Hard filters
- Evidence retrieval
- Claim validation
- Notification idempotency

### Integration tests

Cover:

- API and database interactions
- Worker job execution
- Source connector parsing
- Resume version creation
- Authorization boundaries

### End-to-end tests

Cover at least:

1. Create profile
2. Add evidence
3. Ingest or add a job
4. Generate a match
5. Generate a tailored resume
6. Reject an unsupported claim
7. Approve a valid version
8. Track an application

### LLM evaluation tests

Maintain a small synthetic evaluation set.

Test that:

- Unsupported technologies are not added
- Unsupported numbers are not added
- Missing qualifications are reported as gaps
- Existing facts are preserved
- Evidence IDs are valid
- Output follows the schema

Never use real candidate data in committed test fixtures.

---

## Code Quality

### Python

Use:

- Type hints
- Ruff
- Black
- Pyright or mypy
- Pydantic models
- Clear async boundaries

Avoid broad `except Exception` blocks unless the error is logged, classified, and handled at an appropriate boundary.

### TypeScript

Use:

- Strict mode
- ESLint
- Prettier
- Runtime validation for API data
- Typed API clients
- Accessible components

Avoid `any` unless accompanied by a comment explaining why it is unavoidable.

### General

Prefer small, composable functions.

Do not add abstractions before they have at least two real use cases.

Do not duplicate business rules between the frontend and backend. The backend is authoritative.

---

## Observability

Use structured logs.

Include:

- Request or job correlation ID
- Connector name
- Job ID
- User ID only in a non-sensitive internal identifier form
- Duration
- Outcome
- Retry count

Do not log:

- Full resumes
- Access tokens
- Full email contents
- Phone numbers
- Home addresses
- Sensitive application answers

Track metrics such as:

- Jobs ingested
- Duplicate rate
- Connector failures
- Matching latency
- Notification delivery rate
- Resume generation latency
- Resume validation failures
- Model cost per operation

---

## Agent Workflow

When an AI coding agent receives a task, it should follow this sequence.

### 1. Inspect

Before editing:

- Read this file
- Inspect nearby code
- Identify existing conventions
- Identify relevant tests
- Check for migrations or API contracts
- Avoid assuming a file exists

### 2. Plan

For non-trivial work, create a concise implementation plan.

The plan should include:

- Files to change
- Data model impact
- API impact
- Privacy or security implications
- Tests to add
- Any assumptions

### 3. Implement incrementally

Prefer small, reviewable changes.

Do not combine unrelated refactors with feature work.

Preserve backward compatibility unless the task explicitly allows a breaking change.

### 4. Validate

Run the relevant commands.

Suggested commands:

```bash
# Frontend
pnpm lint
pnpm typecheck
pnpm test
pnpm build

# Backend
ruff check .
black --check .
pyright
pytest

# Full stack
docker compose up -d
```

Use the repository's actual commands when they differ.

### 5. Report

At completion, summarize:

- What changed
- Important design decisions
- Tests run
- Known limitations
- Required migrations or environment variables

Do not claim tests passed unless they were actually run.

---

## Change Boundaries

Agents must not perform the following without an explicit task requirement:

- Replace the core framework
- Change authentication providers
- Add automatic job application submission
- Add stealth scraping
- Store plaintext secrets
- Remove privacy controls
- Disable validation to make a test pass
- Introduce fabricated resume data
- Send real notifications during tests
- Run destructive production migrations
- Delete user data outside an explicit deletion flow

---

## Definition of Done

A task is complete when:

- The implementation satisfies the requested behavior
- Authorization is enforced
- Sensitive data is handled safely
- Errors are handled
- Tests cover the important paths
- Linters and type checks pass where applicable
- Migrations are included for schema changes
- Documentation is updated
- No resume claim can be generated without evidence
- No unsupported external automation is introduced

---

## Initial MVP Priorities

Build in this order unless the issue tracker says otherwise.

### Phase 1

- Authentication
- User profile
- Evidence store
- Manual job entry
- Job tracker
- Deterministic matching

### Phase 2

- One permitted job-source connector
- Scheduled ingestion
- Deduplication
- Email or Telegram notifications

### Phase 3

- Job requirement extraction
- Evidence retrieval
- Resume bullet rewriting
- Claim validation
- Resume versioning
- DOCX or PDF export

### Phase 4

- Additional permitted sources
- Better ranking
- Evaluation dashboard
- Application analytics
- Reliability and privacy hardening

---

## Working Assumptions

Until replaced by repository-specific decisions:

- The initial user is a CS student in Singapore.
- The first supported location is Singapore.
- The product is single-user-capable but designed for multi-user isolation.
- The first release uses manual job URLs plus one permitted source.
- Applications are submitted manually by the user.
- Resume tailoring uses structured evidence and mandatory human review.
- English is the initial product language.
- Dates and times are stored in UTC and displayed in the user's local timezone.
