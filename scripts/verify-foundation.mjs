import { access, readFile } from "node:fs/promises";

const requiredPaths = [
  ".editorconfig",
  ".env.example",
  ".github/workflows/ci.yml",
  ".gitignore",
  "AGENTS.md",
  "BUILD_PLAN.md",
  "README.md",
  "apps/api",
  "apps/api/pyproject.toml",
  "apps/api/src/internscout_api/main.py",
  "apps/api/tests",
  "apps/web",
  "apps/web/package.json",
  "apps/web/src/app/layout.tsx",
  "apps/web/src/app/page.tsx",
  "docker-compose.yml",
  "docs",
  "packages/config",
  "packages/shared-types",
  "packages/ui",
  "scripts",
  "tests",
  "workers/ingestion",
  "workers/matching",
  "workers/notifications"
];

await Promise.all(requiredPaths.map((path) => access(path)));

const gitignore = await readFile(".gitignore", "utf8");
if (!gitignore.split("\n").includes(".env")) {
  throw new Error(".gitignore must exclude the local .env file");
}

console.log(`Foundation verified: ${requiredPaths.length} required paths are present.`);
