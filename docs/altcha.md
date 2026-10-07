# Self-hosted contact-form protection

The widget and proof-of-work verification run locally: no Cloudflare, Google,
Sentinel instance, external verification requests, or third-party API account.
This is a spam deterrent, not a guarantee that the sender is human.

## VPS rollout

Deploy the frontend and API together. Before running the updated deployment
script, add `ALTCHA_HMAC_SECRET` to the application's `.env.production`.
Use a unique, securely generated value of at least 32 characters. Never put it
in a `VITE_` variable, source control, logs, or chat.

To create the setting without displaying its value, run from the app directory:

```bash
python3 - <<'PY'
from pathlib import Path
import secrets
p = Path(".env.production")
if not p.is_file():
    raise SystemExit("Missing .env.production; configure the app environment first.")
text = p.read_text()
if any(line.strip().startswith(("ALTCHA_HMAC_SECRET=", "export ALTCHA_HMAC_SECRET=")) for line in text.splitlines()):
    raise SystemExit("Setting already exists; leave it unchanged unless deliberately rotating.")
with p.open("a") as f:
    f.write("\nALTCHA_HMAC_SECRET=" + secrets.token_hex(32) + "\n")
p.chmod(0o600)
print("Signing secret added without displaying it.")
PY

git pull --ff-only origin main
bash deploy.sh
pm2 save
```

Deployment checks the key before building. A missing/short key in production
returns 503 for verification and contact submission; there is no bypass.
Development uses a fresh ephemeral signing key if no valid key is configured.

The PM2 configuration binds the API to loopback on port 3001. Nginx remains
public and forwards requests using the existing configuration. Express trusts
only loopback proxies, not arbitrary internet forwarding headers.

Verify the public contact form, successful notification and auto-reply delivery,
and that `sudo ss -ltnp | grep ':3001'` shows loopback binding.
Do not submit a real form as a test unless delivery of both test emails is intended.

## Controls

- Five contact attempts per client per 15 minutes, including rejected attempts.
- Twenty challenges per client per five minutes.
- Five-minute expiry, bounded storage, atomic one-use consumption before any
  asynchronous verification. Restarting invalidates all outstanding challenges.
- An invisible honeypot and bounded form fields.
- Invalid verification never reaches either email send.
- Failures retain the visitor's form text and require fresh verification.

## Reuse

The backend factory in `src/lib/altcha-protection.ts` has no database or
Team K5 dependencies. Copy it with its `altcha-lib` dependency into another
Node app, supply a separate secret and scope, mount challenge/submit routes,
and reuse the React widget with that application's base URL.

**One API worker per application is required.** The challenge and rate-limit
stores are process-local. Do not switch PM2 to cluster mode or multiple instances
without replacing these with a shared store supporting atomic consume operations
(for example Redis or a transactional database). Each application owns its own
secret, scope, state, and rate limits; there is no shared verification service.

No database migration is required by this feature.

## Tests and rollback

`pnpm --filter @workspace/api-server run test:altcha` checks valid solutions,
malformed payloads, expiry, modified parameters, replay/concurrent reuse,
instance isolation, honeypots and request limits without sending email.

Rollback frontend and API as a matched pair, not just one side. Rolling back to
the previous unprotected handler reopens spam delivery; retaining the protected
API while deploying an older frontend prevents legitimate submissions too.
