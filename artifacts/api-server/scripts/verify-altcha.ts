import assert from "node:assert/strict";
import { randomBytes } from "node:crypto";
import { solveChallenge } from "altcha-lib";
import { deriveKey } from "altcha-lib/algorithms/pbkdf2";
import { createAltchaProtection } from "../src/lib/altcha-protection";
import express from "express";
import { challengeRouter, contactLimiter, verifyContact } from "../src/routes/contact-protection";

const secret = randomBytes(32).toString("hex");
const guard = createAltchaProtection(secret, "test");
async function solve(challenge: Parameters<typeof solveChallenge>[0]["challenge"]) {
  const solution = await solveChallenge({ challenge, deriveKey });
  assert.ok(solution);
  return Buffer.from(JSON.stringify({ challenge, solution })).toString("base64");
}
const challenge = await guard.challenge();
const payload = await solve(challenge);
assert.equal(await guard.consume("invalid"), false);
assert.deepEqual(await Promise.all([guard.consume(payload), guard.consume(payload)]), [true, false]);
assert.equal(await guard.consume(payload), false);
assert.equal(await createAltchaProtection(secret, "different-app").consume(payload), false);
const expiring = createAltchaProtection(secret, "expiry", 1);
const expired = await expiring.challenge();
await new Promise(resolve => setTimeout(resolve, 5));
assert.equal(await expiring.consume(await solve(expired)), false);
const modified = await guard.challenge();
modified.parameters.cost = 999999999;
assert.equal(await guard.consume(Buffer.from(JSON.stringify({ challenge: modified, solution: {} })).toString("base64")), false);

const app = express();
app.use(express.json());
app.use("/api", challengeRouter);
let deliveries = 0;
app.post("/api/contact", contactLimiter, verifyContact, (_req, res) => { deliveries++; res.json({ ok: true }); });
const server = app.listen(0, "127.0.0.1");
await new Promise<void>(resolve => server.once("listening", resolve));
const address = server.address() as { port: number };
const base = `http://127.0.0.1:${address.port}/api/contact`;
const post = (body: object) => fetch(base, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
try {
  assert.equal((await post({})).status, 400);
  assert.equal((await post({ website: "spam", altcha: payload })).status, 400);
  const response = await fetch(`${base}/challenge`);
  assert.equal(response.headers.get("cache-control"), "no-store");
  const valid = await solve(await response.json());
  assert.equal((await post({ altcha: valid, website: "" })).status, 200);
  assert.equal((await post({ altcha: valid })).status, 400);
  assert.equal((await post({ altcha: "bad" })).status, 400);
  assert.equal((await post({ altcha: "bad" })).status, 429);
  assert.equal(deliveries, 1, "Only valid single-use payload reaches email handler");
  for (let i = 0; i < 19; i++) await fetch(`${base}/challenge`);
  assert.equal((await fetch(`${base}/challenge`)).status, 429);
} finally { server.close(); }
console.log("ALTCHA tests passed: valid, invalid, replay/race, expiry, tampering, cross-instance, honeypot and rate limits.");
