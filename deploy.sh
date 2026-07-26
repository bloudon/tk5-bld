#!/usr/bin/env bash
# deploy.sh — run this on the VPS after each git pull
# Usage:  bash deploy.sh
set -euo pipefail

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Team K5 — Deploy"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# ── 0. Pre-flight checks ───────────────────────────────────────────────────────
if [ -z "${DATABASE_URL:-}" ]; then
  echo "✗ DATABASE_URL is not set."
  echo "  Export it before running deploy.sh:"
  echo "    export DATABASE_URL=\"postgres://user:pass@host:5432/dbname\""
  exit 1
fi

if [ -z "${SMTP2GO_USERNAME:-}" ] || [ -z "${SMTP2GO_PASSWORD:-}" ]; then
  echo "⚠ Warning: SMTP2GO_USERNAME or SMTP2GO_PASSWORD is not set — contact form emails will not send."
fi

if [ -z "${BLOG_ADMIN_PASSWORD:-}" ]; then
  echo "⚠ Warning: BLOG_ADMIN_PASSWORD is not set — blog admin will use the default password."
fi

echo "✓ Pre-flight checks passed"
echo ""

# ── 1. Pull latest code ────────────────────────────────────────────────────────
echo "▶ Pulling latest code..."
git pull origin main

# ── 2. Install / update dependencies ──────────────────────────────────────────
echo ""
echo "▶ Installing dependencies..."
pnpm install --frozen-lockfile

# ── 3. Run database migrations ─────────────────────────────────────────────────
echo ""
echo "▶ Running database migrations..."
pnpm --filter @workspace/db run push

# ── 4. Build frontend ──────────────────────────────────────────────────────────
echo ""
echo "▶ Building frontend..."
# PORT is required by vite.config.ts even for builds; 3000 is a safe placeholder
BASE_PATH=/ PORT=3000 NODE_ENV=production \
  pnpm --filter @workspace/k5-website run build

# ── 5. Build API server ────────────────────────────────────────────────────────
echo ""
echo "▶ Building API server..."
pnpm --filter @workspace/api-server run build

# ── 6. Restart services via PM2 ───────────────────────────────────────────────
echo ""
echo "▶ Restarting services..."
if pm2 list | grep -q "k5-api"; then
  pm2 reload ecosystem.config.cjs --update-env
else
  pm2 start ecosystem.config.cjs
  pm2 save
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  ✓ Deploy complete"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
