# Environment variables

Never commit `.env` or `src/frontend/.env.local`. Use the `.env.example` files as templates.

## Must match across hosts

| Backend (`PROXY_AUTH_TOKEN`) | Frontend (`VITE_PROXY_TOKEN`) |
|------------------------------|-------------------------------|
| Same exact string            | Same exact string             |

After changing any `VITE_*` on Vercel, **redeploy** the frontend (build-time vars).

---

## Local development

**Repo root `.env`**

| Variable | Example |
|----------|---------|
| `PROXY_AUTH_TOKEN` | `my_secret_token` |
| `DATABASE_URL` | `file:./dev.db` |
| `FRONTEND_URL` | `http://localhost:3000` (optional) |
| `TURSO_DATABASE_URL` | (optional, for Turso testing) |
| `TURSO_AUTH_TOKEN` | (optional) |

**`src/frontend/.env.local`**

| Variable | Example |
|----------|---------|
| `VITE_GOOGLE_CLIENT_ID` | `….apps.googleusercontent.com` |
| `VITE_API_BASE` | `http://127.0.0.1:3001` |
| `VITE_PROXY_TOKEN` | same as `PROXY_AUTH_TOKEN` |

---

## Render (backend)

| Variable | Value |
|----------|--------|
| `PROXY_AUTH_TOKEN` | Long random secret |
| `FRONTEND_URL` | `https://<your-vercel-app>.vercel.app` |
| `DATABASE_URL` | `file:./dev.db` (Prisma CLI only) |
| `TURSO_DATABASE_URL` | `libsql://…` (recommended) |
| `TURSO_AUTH_TOKEN` | Turso token |
| `NODE_ENV` | `production` |

**Start command:** `npm run db:migrate:turso && node src/backend/server.js` (if using Turso)  
or `npx prisma migrate deploy && node src/backend/server.js` (ephemeral SQLite only).

Do **not** set `DATABASE_URL` to `libsql://` (Prisma migrate CLI error P1012).

---

## Vercel (frontend)

| Variable | Value |
|----------|--------|
| `VITE_API_BASE` | `https://tokenstats.onrender.com` (your Render URL) |
| `VITE_PROXY_TOKEN` | Same as Render `PROXY_AUTH_TOKEN` |
| `VITE_GOOGLE_CLIENT_ID` | Google OAuth Web client ID |

Google Cloud Console → Authorized JavaScript origins must include your Vercel URL.

---

## Google OAuth

- **Origins:** `http://localhost:3000`, production Vercel URL  
- **Redirect URI (if used):** `https://<vercel>/auth/google/callback`

Provider API keys (OpenAI, Groq, etc.) are **not** env vars for production UX — users paste them in the Workspace UI.
