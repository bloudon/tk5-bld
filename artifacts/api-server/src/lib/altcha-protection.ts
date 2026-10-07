import { createChallenge, verifySolution, type Challenge, type Payload } from "altcha-lib";
import { deriveKey } from "altcha-lib/algorithms/pbkdf2";

/** Single-process store: restarts invalidate all outstanding challenges.
 * Use a shared atomic store before running multiple API workers.
 */
export function createAltchaProtection(secret: string, scope: string, ttlMs = 300_000) {
  const issued = new Map<string, { challenge: Challenge; expires: number }>();
  function prune() {
    for (const [key, value] of issued) if (value.expires <= Date.now()) issued.delete(key);
  }
  return {
    async challenge() {
      prune();
      if (issued.size >= 5000) throw new Error("Challenge capacity reached");
      const expires = Date.now() + ttlMs;
      const challenge = await createChallenge({
        algorithm: "PBKDF2/SHA-256", cost: 1000, keyPrefix: "00",
        deriveKey, hmacSignatureSecret: secret, expiresAt: new Date(expires),
        data: { scope },
      });
      issued.set(challenge.parameters.nonce, { challenge, expires });
      return challenge;
    },
    async consume(encoded: string): Promise<boolean> {
      prune();
      try {
        if (!encoded || encoded.length > 8000) return false;
        const payload = JSON.parse(Buffer.from(encoded, "base64").toString("utf8")) as Payload;
        const nonce = payload.challenge?.parameters?.nonce;
        const record = issued.get(nonce);
        // Never pass client-selected cost/algorithm parameters to the verifier.
        if (!record || JSON.stringify(record.challenge) !== JSON.stringify(payload.challenge)) return false;
        issued.delete(nonce); // Atomic consumption before asynchronous verification.
        const result = await verifySolution({
          challenge: record.challenge, solution: payload.solution,
          deriveKey, hmacSignatureSecret: secret,
        });
        return result.verified;
      } catch {
        return false;
      }
    },
  };
}
