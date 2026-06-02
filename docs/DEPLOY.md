# Deploy: Vercel (frontend) + Turso (DB) + backend host

Frontend stays on **Vercel**. Replace Fly.io SQLite volume with **Turso** (hosted libSQL). Run the Express API on any Node host (Render, Railway, Koyeb, Oracle VM, etc.).

---

## 1. Create Turso database

Install CLI: https://docs.turso.tech/cli

```bash
turso auth login
turso db create tokenstats
turso db show tokenstats --url
turso db tokens create tokenstats
```

Save:

- `TURSO_DATABASE_URL` → `libsql://…` from `db show`
- `TURSO_AUTH_TOKEN` → token from `tokens create`

---

## 2. Apply schema to Turso

**Do not** set `DATABASE_URL` to `libsql://…` — Prisma CLI only accepts `file:` for the `sqlite` provider (`P1012`).

Keep `DATABASE_URL="file:./dev.db"` in `.env` (or omit). Set Turso vars only:

```bash
export TURSO_DATABASE_URL="libsql://your-db-org.turso.io"
export TURSO_AUTH_TOKEN="your-token"

npm install
npm run db:migrate:turso
npm run db:verify
```

`db:migrate:turso` applies `prisma/migrations/*/migration.sql` to Turso. `db:verify` inserts and deletes a test row.

---

## 3. Deploy backend (example: Render)

**Docker / Turso:** Use the repo `Dockerfile` (`node:20-bookworm-slim`). Do not use `node:alpine` — libSQL native modules fail on musl (`fcntl64: symbol not found`).

1. New **Web Service** → connect GitHub repo.
2. **Root directory:** repository root.
3. **Build command:** `npm install && npx prisma generate`
4. **Start command:** `npm run db:migrate:turso && node src/backend/server.js`
5. **Environment variables:**

| Key | Value |
|-----|--------|
| `TURSO_DATABASE_URL` | `libsql://…` |
| `TURSO_AUTH_TOKEN` | Turso token |
| `DATABASE_URL` | `file:./dev.db` (Prisma generate only; app uses Turso via adapter) |
| `PROXY_AUTH_TOKEN` | Long random secret |
| `FRONTEND_URL` | `https://your-app.vercel.app` |
| `PORT` | `3001` (or host default) |
| `NODE_ENV` | `production` |

6. Deploy → note public URL, e.g. `https://tokenstats-api.onrender.com`

**Fly.io (optional):** Remove `[mounts]` from `fly.toml` when using Turso; `fly secrets set TURSO_DATABASE_URL=… TURSO_AUTH_TOKEN=…` (do not set `DATABASE_URL` to libsql).

---

## 4. Redeploy Vercel frontend

Project → **Settings → Environment Variables** (Production):

| Variable | Value |
|----------|--------|
| `VITE_API_BASE` | Backend URL (no trailing slash) |
| `VITE_PROXY_TOKEN` | Same as `PROXY_AUTH_TOKEN` |
| `VITE_GOOGLE_CLIENT_ID` | Google OAuth client ID |

Redeploy (env vars are build-time for Vite).

**Google Cloud Console:** add production origin `https://your-app.vercel.app` to OAuth authorized JavaScript origins.

---

## 5. Smoke test production

1. Open Vercel URL → sign in with Google.
2. Run a prompt with a real provider API key.
3. Open **Analytics** — row should appear.
4. If `401`: `VITE_PROXY_TOKEN` ≠ `PROXY_AUTH_TOKEN`.
5. If CORS error: `FRONTEND_URL` on API must include exact Vercel origin.

---

## Local dev (unchanged)

```bash
# .env
DATABASE_URL="file:./dev.db"
PROXY_AUTH_TOKEN=dev-secret

npm run db:migrate
npm run dev:backend
npm run dev:frontend
```

No Turso vars needed locally — uses `prisma/dev.db`.

---

## Switching from Fly.io SQLite volume

1. Export old data if needed: `fly ssh console` → copy `/app/data/dev.db` or use `turso db shell` after import.
2. For fresh start: only run `npm run db:migrate:turso`.
3. Remove Fly volume mount when fully on Turso.
