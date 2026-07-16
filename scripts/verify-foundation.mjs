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
  "apps/web",
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

