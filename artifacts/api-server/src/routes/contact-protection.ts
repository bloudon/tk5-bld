import { randomBytes } from "node:crypto";
import { Router, type RequestHandler } from "express";
import { rateLimit } from "express-rate-limit";
import { createAltchaProtection } from "../lib/altcha-protection";
import { logger } from "../lib/logger";

const production = process.env.NODE_ENV === "production";
const configured = process.env.ALTCHA_HMAC_SECRET;
// Development uses a real ephemeral secret, never a verification bypass.
const secret = configured && configured.length >= 32 ? configured : !production ? randomBytes(32).toString("hex") : null;
if (!configured && !production) logger.info("ALTCHA using ephemeral development signing key");
const protection = secret ? createAltchaProtection(secret, "team-k5-contact") : null;

const limiter = (limit: number, windowMs: number) => rateLimit({
  windowMs, limit, standardHeaders: "draft-8", legacyHeaders: false,
  message: { error: "Too many attempts. Please wait a few minutes and try again, or call us." },
});

export const contactLimiter = limiter(5, 15 * 60_000);
export const challengeRouter = Router();
challengeRouter.get("/contact/challenge", limiter(20, 5 * 60_000), async (_req, res) => {
  res.set("Cache-Control", "no-store");
  if (!protection) {
    res.status(503).json({ error: "Verification is temporarily unavailable. Please call us." });
    return;
  }
  try {
    res.json(await protection.challenge());
  } catch {
    res.status(503).json({ error: "Verification is busy. Please try again shortly." });
  }
});

export const verifyContact: RequestHandler = async (req, res, next) => {
  if (!protection) {
    res.status(503).json({ error: "Verification is temporarily unavailable. Please call us." });
    return;
  }
  const { altcha, website } = req.body ?? {};
  if ((website !== undefined && website !== "") || typeof altcha !== "string" || !await protection.consume(altcha)) {
    res.status(400).json({ error: "Please complete a fresh spam verification and try again." });
    return;
  }
  next();
};
