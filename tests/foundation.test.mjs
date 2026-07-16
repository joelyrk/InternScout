import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("root package is private and exposes foundation checks", async () => {
  const packageJson = JSON.parse(await readFile("package.json", "utf8"));

  assert.equal(packageJson.private, true);
  assert.equal(packageJson.scripts.verify, "node scripts/verify-foundation.mjs");
  assert.equal(packageJson.scripts.dev, "npm run dev --workspace @internscout/web");
  assert.ok(packageJson.workspaces.includes("apps/*"));
});

test("example environment file contains placeholders, not a copied local environment", async () => {
  const example = await readFile(".env.example", "utf8");

  assert.match(example, /^POSTGRES_PASSWORD=local-development-only$/m);
  assert.doesNotMatch(example, /^(OPENAI_API_KEY|AUTH_SECRET|AWS_SECRET_ACCESS_KEY)=.+$/m);
});
