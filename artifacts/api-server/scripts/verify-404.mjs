import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { once } from "node:events";

const port = 31991;
const child = spawn(process.execPath, ["--enable-source-maps", "./dist/index.mjs"], {
  cwd: new URL("..", import.meta.url),
  env: {
    ...process.env,
    PORT: String(port),
    DATABASE_URL: process.env.DATABASE_URL ?? "postgresql://test:test@127.0.0.1:1/test",
    NODE_ENV: "test",
  },
  stdio: ["ignore", "pipe", "pipe"],
});

try {
  await Promise.race([
    new Promise((resolve, reject) => {
      child.stdout.on("data", (chunk) => {
        if (chunk.toString().includes("Server listening")) resolve();
      });
      child.stderr.on("data", (chunk) => {
        const message = chunk.toString();
        if (message.includes("Error listening")) reject(new Error(message));
      });
    }),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error("API server did not start")), 10_000),
    ),
  ]);

  const response = await fetch(`http://127.0.0.1:${port}/api/does-not-exist`);
  assert.equal(response.status, 404);
  assert.match(response.headers.get("content-type") ?? "", /application\/json/);
  assert.deepEqual(await response.json(), {
    error: "not_found",
    message: "API endpoint not found",
    path: "/does-not-exist",
  });
  console.log("API JSON 404 response verified.");
} finally {
  child.kill("SIGTERM");
  await once(child, "exit").catch(() => {});
}