# BUILD_PLAN.md

## Purpose

This plan breaks the internship discovery and resume-tailoring application into small, sequential phases. Complete, test, and commit each phase before starting the next.

## Build Rules

1. Keep the application runnable after every phase.
2. Add one major capability at a time.
3. Use synthetic data during development.
4. Write tests alongside features.
5. Prefer deterministic logic before AI.
6. Never automate application submission.
7. Never generate resume claims without verified evidence.
8. Document permitted access before adding a job source.
9. Do not mix unrelated refactors with feature work.
10. Record major decisions in `docs/decisions/`.

---

# Milestone 0 — Repository Foundation

## Phase 0.1 — Initialize the Monorepo

### Goal

Create the repository structure and shared development tooling.

### Tasks

- Initialize Git.
- Create:

```text
apps/web
apps/api
workers
packages
tests
docs
scripts
```

- Add `.gitignore`, `.editorconfig`, `.env.example`, `README.md`, `AGENTS.md`, and `BUILD_PLAN.md`.
- Configure the root package manager.
- Add Docker Compose placeholders for PostgreSQL and Redis.
- Add a basic CI workflow.

### Exit Criteria

- Dependencies install successfully.
- CI runs a placeholder test.
- No secrets are committed.
- The README explains local startup.

## Phase 0.2 — Frontend Skeleton

### Goal

Create a navigable Next.js application.

### Tasks

- Initialize Next.js with TypeScript strict mode.
- Add Tailwind CSS, linting, and formatting.
- Add placeholder pages for Dashboard, Jobs, Resume, Applications, and Settings.
- Add navigation, loading, error, and empty states.

### Exit Criteria

- The frontend builds.
- Every placeholder route loads.
- Linting and type checks pass.
- Navigation is keyboard accessible.

## Phase 0.3 — Backend Skeleton

### Goal

Create a minimal FastAPI service.

### Tasks

- Initialize Python 3.12+, FastAPI, and Pydantic.
- Add Ruff, Black, Pyright or mypy, and pytest.
- Add `/health` and `/ready`.
- Add environment-based settings.
- Define a standard API error shape.

### Exit Criteria

- The API starts locally.
- Health endpoints return successfully.
- Tests, linting, and type checks pass.

## Phase 0.4 — Connect Frontend and Backend

### Goal

Verify typed communication between both applications.

### Tasks

- Configure the frontend API URL.
- Create a typed API client.
- Display backend health on a development page.
- Add timeout and network error handling.
- Configure local CORS.

### Exit Criteria

- The frontend displays backend status.
- Errors are user-readable.
- Responses are runtime validated.

---

# Milestone 1 — Database and Authentication

## Phase 1.1 — Add PostgreSQL

### Goal

Establish persistent storage and migrations.

### Tasks

- Add PostgreSQL to Docker Compose.
- Configure SQLAlchemy and Alembic.
- Add database session and transaction helpers.
- Add an initial migration.
- Add isolated integration tests.

### Exit Criteria

- Migrations run from an empty database.
- Migrations can be rolled back.
- Tests use a separate database.
- Credentials come from environment variables.

## Phase 1.2 — Add Authentication

### Goal

Allow secure sign-in and enforce user isolation.

### Tasks

- Choose an authentication provider.
- Add login and logout.
- Protect frontend routes.
- Validate authentication in the backend.
- Create a local `users` table.
- Create the user record on first access.

### Exit Criteria

- Private pages require login.
- Invalid tokens are rejected.
- The backend never trusts a client-provided user ID.
- Unauthorized access tests pass.

## Phase 1.3 — Add User Profile

### Goal

Store internship preferences and eligibility details.

### Fields

- Degree and university
- Graduation year
- Skills
- Role interests
- Preferred locations
- Availability dates
- Minimum duration
- Work authorization
- Timezone

### Tasks

- Create the profile model and migration.
- Add read and update endpoints.
- Build the profile form.
- Validate dates and values.
- Add profile completion status.

### Exit Criteria

- Profile data persists.
- Users can access only their own profile.
- Invalid inputs are rejected.
- API and UI tests pass.

---

# Milestone 2 — Verified Evidence Store

## Phase 2.1 — Evidence Items

### Goal

Create the trusted facts used for resume generation.

### Categories

Education, employment, project, coursework, award, leadership, skill, and certification.

### Tasks

- Create `evidence_items`.
- Add CRUD endpoints and UI.
- Store fact text, technologies, metrics, dates, category, source, and verification state.
- Add timestamps.

### Exit Criteria

- Evidence persists.
- Users can edit and delete only their own evidence.
- Authorization tests pass.
- Test fixtures contain no real personal data.

## Phase 2.2 — Experience Grouping

### Goal

Group evidence into coherent resume experiences.

### Tasks

- Create `experiences`.
- Support projects, employment, education, and leadership.
- Associate evidence with experiences.
- Add ordering and an editor.

### Exit Criteria

- Evidence can be grouped and reordered.
- Deleting a group does not silently delete evidence.
- Grouping behavior is tested.

## Phase 2.3 — Master Resume

### Goal

Represent the base resume as structured data.

### Tasks

- Create a master resume record.
- Select and order experiences and sections.
- Add a simple preview.
- Keep the master separate from tailored versions.

### Exit Criteria

- The master resume references evidence.
- It can be previewed and edited.
- No AI-generated claims are present.

---

# Milestone 3 — Manual Job Tracking

## Phase 3.1 — Manual Job Entry

### Goal

Let the user save an internship without automated ingestion.

### Fields

Company, title, location, description, application URL, source, posted date, closing date, and status.

### Tasks

- Create `jobs`.
- Add CRUD endpoints.
- Build job form, list, and details pages.
- Validate URLs.
- Render descriptions safely.

### Exit Criteria

- Jobs persist.
- User ownership is enforced.
- Invalid URLs are rejected.
- Long descriptions render correctly.

## Phase 3.2 — Application Pipeline

### Goal

Track application progress.

### Statuses

Discovered, saved, preparing, applied, interviewing, offer, rejected, withdrawn, and closed.

### Tasks

- Create `applications`.
- Add status transitions, notes, dates, and history.
- Build a grouped list or Kanban view.

### Exit Criteria

- Changes persist with history.
- Invalid transitions are handled.
- No external submission occurs.

## Phase 3.3 — Filters and Sorting

### Goal

Make the job list useful at moderate scale.

### Tasks

- Filter by company, location, status, closing date, and keyword.
- Sort by recently added, closing soon, score, and company.
- Persist filter state in query parameters.

### Exit Criteria

- Filters combine correctly.
- Views are shareable through their URL.
- Empty states are clear.

---

# Milestone 4 — Deterministic Matching

## Phase 4.1 — Skill Normalization

### Goal

Compare profile and job skills without AI.

### Tasks

- Create a canonical skill dictionary and aliases.
- Normalize profile skills.
- Detect known skills in job descriptions.
- Store extracted skills.

### Exit Criteria

- Aliases normalize consistently.
- Extraction is deterministic.
- Common languages, frameworks, and tools have tests.

## Phase 4.2 — Eligibility Checks

### Goal

Identify reliable incompatibilities before ranking.

### Checks

- Job is closed.
- Dates do not overlap.
- Graduation year conflicts.
- Location conflicts.
- Work authorization explicitly conflicts.

### Tasks

- Return compatible, incompatible, or unknown.
- Display supporting notes.
- Never reject based on missing data.

### Exit Criteria

- Known conflicts are detected.
- Unknown remains unknown.
- Rules have boundary tests.
- AI is not the final eligibility authority.

## Phase 4.3 — Initial Match Score

### Goal

Rank jobs transparently.

### Initial Components

- Skill overlap
- Role keyword overlap
- Location
- Availability
- Eligibility
- Freshness

### Tasks

- Create configurable scoring rules.
- Store component scores in `job_matches`.
- Add calculation and recalculation endpoints.
- Display the explanation.

### Exit Criteria

- Identical inputs produce identical scores.
- Score components are visible.
- Hard conflicts are clearly shown.
- Boundary tests pass.

## Phase 4.4 — User Feedback

### Goal

Let users correct recommendations.

### Tasks

- Add relevant, not relevant, hide company, and hide keyword actions.
- Store feedback separately.
- Apply explicit exclusions before ranking.
- Add undo.

### Exit Criteria

- Hidden companies and keywords are respected.
- Raw job data is unchanged.
- Undo restores prior behavior.

---

# Milestone 5 — First Job Source

## Phase 5.1 — Connector Framework

### Goal

Create a reusable ingestion boundary.

### Tasks

- Define `RawJob` and `JobSource`.
- Add rate limits, timeouts, retries, configuration, and structured logs.
- Add a fake connector for tests.
- Make processing idempotent.

### Exit Criteria

- The fake connector ingests jobs.
- Repeated runs do not duplicate jobs.
- A connector failure does not crash the API.

## Phase 5.2 — Source Compliance Note

### Goal

Document why the first source can be accessed.

### Tasks

Create `docs/sources/<source-name>.md` covering:

- Owner
- Access method
- Authentication
- Terms review date
- Rate limits
- Collected fields
- Retention
- Removal
- Restrictions

### Exit Criteria

- The access method is clearly permitted.
- The planned connector matches the documentation.
- No login bypass or stealth scraping is involved.

## Phase 5.3 — Implement One Connector

### Goal

Ingest one real, permitted source.

### Tasks

- Fetch and validate source data.
- Normalize fields.
- Store source metadata.
- Add fixtures and parser tests.
- Add failure handling.
- Add a manual ingestion command.

### Exit Criteria

- Ingestion works through the documented method.
- Re-running it is idempotent.
- Tests do not call the live source.
- Failures are safely logged.

## Phase 5.4 — Scheduled Ingestion

### Goal

Run ingestion automatically.

### Tasks

- Add Redis and a worker.
- Add scheduled execution and distributed locking.
- Add retries and ingestion history.
- Add an operational status page.

### Exit Criteria

- Only one run per source executes at a time.
- Failed runs retry safely.
- Last-success status is visible.
- The web application remains responsive.

---

# Milestone 6 — Deduplication

## Phase 6.1 — Exact Deduplication

### Goal

Prevent obvious duplicate listings.

### Tasks

- Normalize company, title, location, and URLs.
- Calculate content hashes.
- Add appropriate unique constraints.
- Preserve source records independently.

### Exit Criteria

- Repeated ingestion is idempotent.
- Multiple source URLs can refer to one canonical job.
- Exact duplicate tests pass.

## Phase 6.2 — Candidate Duplicate Detection

### Goal

Surface likely duplicates without unsafe automatic merging.

### Tasks

- Compare company, title, location, and description similarity.
- Store candidate pairs and confidence.
- Add a review screen.

### Exit Criteria

- Low-confidence pairs are not merged.
- Review decisions have an audit trail.
- False-positive cases are tested.

## Phase 6.3 — Safe Merge

### Goal

Merge confirmed duplicates transactionally.

### Tasks

- Preserve all source URLs and earliest first-seen date.
- Select the best closing date.
- Redirect matches and applications.
- Record merge history.

### Exit Criteria

- No applications are lost.
- Merge is atomic.
- Rollback behavior is tested.

---

# Milestone 7 — Notifications

## Phase 7.1 — Notification Preferences

### Goal

Give users control over alerts.

### Preferences

Enabled state, minimum score, immediate threshold, digest time, quiet hours, timezone, blocked companies, and excluded keywords.

### Exit Criteria

- Preferences persist per user.
- Quiet hours work across midnight.
- Inputs are validated.

## Phase 7.2 — One Notification Channel

### Goal

Send a real email or Telegram alert.

### Tasks

- Configure one provider.
- Include company, role, score, reasons, and application URL.
- Add a test-notification action.
- Stub delivery in tests.

### Exit Criteria

- Test delivery is opt-in.
- Failures are recorded.
- Tests never send real messages.
- Provider secrets remain server-side.

## Phase 7.3 — Idempotency

### Goal

Prevent repeated alerts.

### Tasks

- Store notification records.
- Add an idempotency key based on user, job, type, and job version.
- Track queued, sent, failed, and suppressed states.
- Retry temporary failures.

### Exit Criteria

- Successful alerts are not duplicated.
- Retries are safe.
- Quiet-hour alerts can enter the next digest.

## Phase 7.4 — Daily Digest

### Goal

Send a compact summary of new matches.

### Tasks

- Group unseen jobs by user.
- Sort by score and closing date.
- Limit digest length.
- Skip empty digests.
- Record delivery.

### Exit Criteria

- Digests respect the user timezone.
- Previously delivered items are not repeatedly included.
- Empty digests are suppressed.

---

# Milestone 8 — Resume Versioning Without AI

## Phase 8.1 — Job-Specific Resume Versions

### Goal

Create a safe copy of the master resume.

### Tasks

- Create `resume_versions`.
- Associate a draft with a job.
- Preserve the master.
- Support draft, approved, and exported states.

### Exit Criteria

- The master is never overwritten.
- Version history is visible.
- Evidence links remain intact.

## Phase 8.2 — Manual Tailoring

### Goal

Allow tailoring before introducing AI.

### Tasks

- Select experiences.
- Reorder or hide bullets.
- Show target job keywords.
- Display a diff from the master.

### Exit Criteria

- Changes affect only the selected version.
- The diff is accurate.
- Evidence references remain valid.

## Phase 8.3 — DOCX Export

### Goal

Export approved resume versions.

### Tasks

- Create a DOCX template.
- Render structured content.
- Warn about excessive page length.
- Store exports privately.
- Use expiring signed links.

### Exit Criteria

- Only approved versions export.
- Export matches preview.
- Links expire.
- Contact details are not logged.

---

# Milestone 9 — AI Requirement Extraction

## Phase 9.1 — LLM Provider Abstraction

### Goal

Keep business logic independent of one provider.

### Tasks

- Define an LLM client interface.
- Add provider settings, timeouts, retries, model metadata, cost telemetry, and a fake test provider.

### Exit Criteria

- Tests use the fake provider.
- Provider failures are handled.
- Secrets stay server-side.
- Output is treated as untrusted input.

## Phase 9.2 — Structured Job Analysis

### Goal

Extract validated requirements from descriptions.

### Schema

```json
{
  "must_have": [],
  "nice_to_have": [],
  "responsibilities": [],
  "keywords": [],
  "eligibility": []
}
```

### Tasks

- Write a constrained prompt.
- Validate JSON against the schema.
- Cache analysis by canonical job.
- Show extracted requirements.

### Exit Criteria

- Nothing is stored before validation.
- Invalid outputs retry or fail clearly.
- Cached analysis is reused.
- Extracted eligibility is informational only.

## Phase 9.3 — Extraction Evaluation

### Goal

Measure requirement extraction quality.

### Tasks

- Build a synthetic evaluation set.
- Measure missing requirements, incorrect requirements, schema failures, and keyword quality.
- Version prompt changes.

### Exit Criteria

- Evaluation is repeatable.
- Known failure cases are documented.
- Regressions are visible.

---

# Milestone 10 — Evidence Retrieval

## Phase 10.1 — Deterministic Retrieval

### Goal

Find relevant verified evidence through keywords and structured fields.

### Tasks

- Match skills and technologies.
- Match requirement words to evidence.
- Prefer verified evidence.
- Return evidence IDs and reasons.

### Exit Criteria

- Results are deterministic.
- Unsupported requirements return no evidence.
- Positive and negative cases are tested.

## Phase 10.2 — Semantic Retrieval

### Goal

Improve recall when wording differs.

### Tasks

- Add evidence and requirement embeddings.
- Store vectors in PostgreSQL.
- Combine semantic and keyword scores.
- Set a minimum similarity threshold.
- Cache embeddings.

### Exit Criteria

- Semantic similarity never creates evidence.
- Weak matches are labeled.
- Embedding generation is idempotent.
- Cost is measured.

## Phase 10.3 — Evidence Review UI

### Goal

Let the user control what generation may use.

### Tasks

- Show evidence mapped to requirements.
- Allow inclusion and exclusion.
- Show missing requirements.
- Require verified evidence for claims.

### Exit Criteria

- Excluded evidence is not sent to the model.
- Missing evidence remains visible.
- User choices persist.

---

# Milestone 11 — AI Resume Tailoring

## Phase 11.1 — Rewrite One Bullet

### Goal

Limit generation scope.

### Tasks

- Supply the original bullet, one requirement, and selected evidence.
- Require structured output and evidence IDs.
- Generate one candidate rewrite.
- Show original versus generated text.

### Exit Criteria

- Referenced evidence IDs are valid.
- The original is preserved.
- No automatic approval occurs.

## Phase 11.2 — Deterministic Claim Validation

### Goal

Block fabricated content.

### Validators

- Numbers must exist in evidence.
- Technologies must exist in evidence.
- Dates must not change.
- Project and company names must not change.
- Employment type must not change.

### Exit Criteria

- Unsupported metrics and technologies fail.
- Validation is enforced in the backend.
- Adversarial tests pass.

## Phase 11.3 — User Approval

### Goal

Require explicit approval for every generated edit.

### Tasks

- Add accept, reject, edit manually, and regenerate.
- Record approval history, model version, and prompt version.
- Update preview only after acceptance.

### Exit Criteria

- Rejected text is excluded.
- Manual edits remain traceable.
- Approval history persists.

## Phase 11.4 — Full Resume Tailoring

### Goal

Coordinate evidence and rewriting across the resume.

### Tasks

- Recommend experiences to prioritize.
- Recommend bullets to hide.
- Rewrite selected bullets individually.
- Enforce section and page limits.
- Produce a complete diff.
- Require final approval.

### Exit Criteria

- Every generated claim maps to evidence.
- Individual changes can be rejected.
- The master remains unchanged.
- Export requires approval.

---

# Milestone 12 — Improved Matching

## Phase 12.1 — Semantic Job Similarity

### Goal

Improve ranking beyond exact overlap.

### Tasks

- Embed user interests and job descriptions.
- Add semantic similarity as a configurable score component.
- Recalculate when profile data changes.

### Exit Criteria

- Semantic score cannot override hard incompatibility.
- Components remain visible.
- Embeddings are cached.

## Phase 12.2 — Feedback-Based Preferences

### Goal

Use explicit user feedback without creating an opaque model.

### Tasks

- Add simple boosts and penalties from feedback.
- Show active preferences.
- Add reset controls.

### Exit Criteria

- Explicit exclusions always win.
- Reset restores default ranking.
- Adjustments are explainable.

## Phase 12.3 — Ranking Evaluation

### Goal

Measure recommendation quality.

### Metrics

Precision at 5, precision at 10, eligibility error rate, and duplicate rate.

### Exit Criteria

- Evaluation is repeatable.
- Ranking changes include evaluation results.
- Serious eligibility regressions are detected.

---

# Milestone 13 — Security and Privacy

## Phase 13.1 — Authorization Audit

### Goal

Verify complete user isolation.

### Tasks

- Test every user-owned endpoint.
- Attempt cross-user access.
- Review worker credentials, signed URLs, and internal endpoints.

### Exit Criteria

- Cross-user reads and writes fail.
- Internal endpoints require service authentication.
- Tests cover all sensitive resources.

## Phase 13.2 — Sensitive Data Reduction

### Goal

Minimize exposure to logs and model providers.

### Tasks

- Redact contact details before model calls.
- Remove irrelevant fields.
- Filter logs.
- Document retention rules.
- Create a data-flow map.

### Exit Criteria

- Full resumes are not logged.
- Model calls contain only necessary data.
- Retention is documented.

## Phase 13.3 — Data Export and Deletion

### Goal

Give users control over their data.

### Tasks

- Export profile, evidence, jobs, applications, and resume versions.
- Delete records and private files.
- Cancel scheduled notifications.

### Exit Criteria

- Export is machine-readable.
- Deletion removes owned records and files.
- Deleted users receive no alerts.

---

# Milestone 14 — Reliability and Observability

## Phase 14.1 — Structured Logging

### Goal

Make failures diagnosable without exposing private content.

### Tasks

- Add correlation IDs, worker IDs, source names, duration, and outcome.
- Filter sensitive fields.

### Exit Criteria

- A failed ingestion run can be traced.
- Logs contain no resumes, tokens, or secrets.

## Phase 14.2 — Metrics

### Goal

Measure system and product health.

### Metrics

- Jobs ingested
- Connector failures
- Duplicate rate
- Matching latency
- Notification delivery
- Resume generation latency
- Validation rejection rate
- Model cost

### Exit Criteria

- Core workers emit metrics.
- Repeated connector failure can trigger an alert.
- Metrics contain no personal data.

## Phase 14.3 — Recovery Tools

### Goal

Recover safely from failures.

### Tasks

- Add retry and dead-letter handling.
- Add safe manual replay.
- Confirm idempotency.
- Document backup and restore.
- Add expired-export cleanup.

### Exit Criteria

- Failed jobs can be replayed safely.
- Replay does not duplicate notifications.
- Recovery procedures are documented.

---

# Milestone 15 — Product Polish

## Phase 15.1 — Onboarding and Empty States

### Goal

Make first use understandable.

### Tasks

- Add onboarding guidance.
- Add a profile checklist.
- Improve empty, loading, and error states.

### Exit Criteria

- Every empty page gives a clear next action.
- Errors explain how to recover.

## Phase 15.2 — Accessibility

### Goal

Make primary workflows accessible.

### Tasks

- Test keyboard navigation, labels, focus, contrast, and screen-reader announcements.
- Avoid drag-only interactions.

### Exit Criteria

- Critical workflows work with a keyboard.
- Form errors are accessible.
- Automated accessibility tests pass.

## Phase 15.3 — Responsive Layout

### Goal

Support checking jobs and alerts on mobile.

### Tasks

- Optimize navigation, cards, tables, and job details.
- Keep complex resume editing desktop-friendly where needed.

### Exit Criteria

- Essential controls remain usable on small screens.
- Job details and alerts work well on mobile.

---

# Milestone 16 — Additional Sources

## Phase 16.1 — Second Connector

### Goal

Prove the connector framework generalizes.

### Exit Criteria

- Cross-source duplicates are handled.
- One source can fail independently.
- Source-specific metrics exist.

## Phase 16.2 — Authorized Email Alerts

### Goal

Create jobs from user-authorized alert emails.

### Tasks

- Process only allowed senders and formats.
- Extract the minimum necessary fields.
- Ignore unrelated mail.
- Add synthetic fixtures.

### Exit Criteria

- Only authorized messages are processed.
- Unrelated content is not retained.
- Parsers are tested without real email.

## Phase 16.3 — User-Submitted URL Import

### Goal

Extract job details from a public URL safely.

### Tasks

- Validate URLs and redirects.
- Block private network addresses.
- Protect against SSRF.
- Require review before saving.

### Exit Criteria

- Private destinations are blocked.
- Extracted fields are editable.
- Unsupported sites fail safely.

---

# Milestone 17 — Release

## Phase 17.1 — Production Infrastructure

### Tasks

- Configure production PostgreSQL, Redis, object storage, secrets, HTTPS, and backups.

### Exit Criteria

- Development secrets are not reused.
- HTTPS is enforced.
- Backups are enabled.
- Admin access is restricted.

## Phase 17.2 — Deployment Pipeline

### Tasks

- Add staging and production.
- Run tests and health checks before release.
- Run migrations safely.
- Document rollback.

### Exit Criteria

- Failed checks stop deployment.
- Migrations are tracked.
- Rollback is documented.
- Test alerts cannot reach real users.

## Phase 17.3 — Private Beta

### Goal

Test with a small group of Singapore CS students.

### Collect

- Match relevance
- Missing sources
- Notification usefulness
- Resume edit acceptance
- Validation failures
- Usability feedback

### Exit Criteria

- No critical authorization issue remains.
- Unsupported claims cannot reach export.
- Account deletion works.
- Core workflows are reliable.

---

# First Useful Release

Target these capabilities for the first private release:

1. Authentication
2. User profile
3. Verified evidence store
4. Manual job entry
5. Application tracking
6. Deterministic matching
7. One permitted job source
8. Notifications
9. Resume versioning
10. AI requirement extraction
11. Evidence-grounded bullet rewriting
12. Claim validation
13. DOCX export
14. Privacy controls

Do not wait for all later milestones before testing with users.

---

# Immediate Starting Sequence

Build these ten tasks first:

1. Initialize the monorepo.
2. Start the Next.js frontend.
3. Start the FastAPI backend.
4. Add PostgreSQL and Alembic.
5. Connect the frontend to `/health`.
6. Add authentication.
7. Add the user profile.
8. Add evidence items.
9. Add manual job creation.
10. Add deterministic skill matching.

After task 10, a signed-in user should be able to:

- Describe internship preferences
- Store verified experience
- Add an internship manually
- Receive an explainable match score
- Track the opportunity in an application pipeline

This is the first meaningful vertical slice.

---

# Commit Strategy

Use one focused commit per small phase or subtask.

```text
chore: initialize monorepo
feat(api): add health endpoints
feat(auth): validate user sessions
feat(profile): add profile schema and endpoints
feat(evidence): add verified evidence items
feat(jobs): support manual job creation
feat(matching): add deterministic skill score
feat(ingestion): define job source interface
feat(notifications): add delivery idempotency
feat(resume): create job-specific versions
feat(ai): extract structured job requirements
feat(resume): validate generated claims
```

Avoid combining formatting, dependency upgrades, migrations, and product features in one commit.

---

# Phase Completion Template

```text
Phase:
Goal:

Implemented:
-

Tests added:
-

Commands run:
-

Database changes:
-

Environment variables:
-

Security and privacy review:
-

Known limitations:
-

Ready for next phase: yes/no
```
