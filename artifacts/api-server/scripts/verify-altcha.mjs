import { build } from "esbuild";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { randomBytes } from "node:crypto";
const directory = await mkdtemp(path.join(tmpdir(), "altcha-test-"));
try {
  const outfile = path.join(directory, "test.cjs");
  await build({
    stdin: { contents: 'import("./scripts/verify-altcha.ts").catch(err => { console.error(err); process.exit(1); });', resolveDir: process.cwd() },
    bundle: true, platform: "node", format: "esm", outfile,
    // Use .mjs with createRequire for Express dependencies.
    banner: { js: 'import { createRequire } from "node:module"; const require = createRequire(import.meta.url);' },
  });
  const { rename } = await import("node:fs/promises");
  await rename(outfile, `${outfile}.mjs`);
  const result = spawnSync(process.execPath, [`${outfile}.mjs`], {
    stdio: "inherit", env: { ...process.env, NODE_ENV: "production", LOG_LEVEL: "silent", ALTCHA_HMAC_SECRET: randomBytes(32).toString("hex") },
  });
  if (result.status !== 0) process.exitCode = 1;
} finally { await rm(directory, { recursive: true, force: true }); }
