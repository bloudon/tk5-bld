# VPS Deployment Guide — Team K5 Website

## Architecture on the server

```
Internet → Nginx (80/443)
              ├── /api/*  → PM2: api-server (localhost:3001)
              └── /*      → Prerendered route HTML and static assets
```

---

## Prerequisites (one-time, on the server)

SSH into your VPS and run `deploy/setup.sh` **once**:

```bash
ssh user@yourserver
git clone https://github.com/bloudon/tk5-bld.git /var/www/k5-website
cd /var/www/k5-website
bash deploy/setup.sh
```

That script installs Node.js 20, pnpm, PM2, builds the app, and starts it.

---

## Environment variables (one-time, on the server)

Create `/var/www/k5-website/.env` with these values:

```env
# Database — must be a Postgres instance reachable from this server
# Options: install Postgres locally, or use Neon/Supabase free tier
DATABASE_URL=postgres://user:password@host:5432/dbname

# API server port (keep 3001 unless you change the Nginx config)
PORT=3001

# SMTP2GO credentials (same as Replit)
SMTP2GO_USERNAME=your_smtp2go_username
SMTP2GO_PASSWORD=your_smtp2go_password

# SMTP settings
SMTP2GO_HOST=mail.smtp2go.com
SMTP2GO_PORT=587
SMTP_FROM_EMAIL=info@bldpermit.com
SMTP_FROM_NAME=Team K5 Permitting Services
SMTP_REPLY_TO=info@bldpermit.com
CONTACT_TO_EMAIL=info@bldpermit.com

# Blog admin password
BLOG_ADMIN_PASSWORD=your_secure_password_here

# Session secret (any long random string)
SESSION_SECRET=your_long_random_secret_here
```

> **Never commit `.env` to git.** It's already in `.gitignore`.

### Set up the database

If using a local Postgres install:
```bash
sudo -u postgres psql -c "CREATE USER k5 WITH PASSWORD 'yourpassword';"
sudo -u postgres psql -c "CREATE DATABASE k5website OWNER k5;"
# Then run migrations:
cd /var/www/k5-website && pnpm --filter @workspace/db run push
```

If using Neon or Supabase, just paste their connection string as `DATABASE_URL` and run the push.

---

## Nginx config (one-time)

```bash
sudo cp /var/www/k5-website/nginx.conf.example /etc/nginx/sites-available/k5-website
sudo ln -s /etc/nginx/sites-available/k5-website /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

Obtain one certificate covering the canonical and redirect hosts, then install
the paths shown in `nginx.conf.example`:
```bash
sudo certbot --nginx -d bldpermit.com -d www.bldpermit.com -d expeditepermit.com -d www.expeditepermit.com
```

---

## Routine deploys (every update from Replit)

SSH in and run one command:

```bash
cd /var/www/k5-website && bash deploy/deploy.sh
```

That's it — pulls latest code, installs deps, rebuilds, restarts the API.

The deploy exits before restart if the prerendered metadata, canonical URLs,
sitemap, internal links, or 404 output fail verification.

---

## Useful PM2 commands

```bash
pm2 status              # see if k5-api is running
pm2 logs k5-api         # tail logs
pm2 restart k5-api      # manual restart
pm2 monit               # live process monitor
```
