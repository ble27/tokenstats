# TokenStats

TokenStats is a React dashboard for signing in with Google, running LLM prompts through the token tracker proxy, and reviewing usage analytics.

## Features

- Google OAuth sign-in (popup flow)
- Dashboard shell with **Workspace** and **Analytics** tabs
- Per-prompt provider API keys (OpenAI/Groq `sk-…`, Perplexity `pplx-…`) verified on every run
- App-level proxy auth via `VITE_PROXY_TOKEN` (matches server `PROXY_AUTH_TOKEN`)
- Dark Supabase/Neon-inspired layout with unified `--bg` surfaces

## Getting Started

### Prerequisites

- Node.js 18+
- npm
- Root API server (`node server.js` from repo root) with database configured

### Installation

```bash
cd token-stats
npm install
cp .env.example .env.local
```

Configure `.env.local`:

| Variable | Purpose |
|----------|---------|
| `VITE_GOOGLE_CLIENT_ID` | Google OAuth Web client ID |
| `VITE_API_BASE` | Proxy base URL (default `http://127.0.0.1:3001`) |
| `VITE_PROXY_TOKEN` | Bearer token for app gate — must match `PROXY_AUTH_TOKEN` on the server |

Provider API keys are **not** set in env files. Enter them in the Workspace toolbar; they are kept in session storage (optional convenience) and sent only with each `POST /v1/chat` request. The server verifies keys before calling the provider and does not persist them.

### Google OAuth setup

1. Create an OAuth 2.0 **Web application** client in [Google Cloud Console](https://console.cloud.google.com/apis/credentials).
2. Add **Authorized JavaScript origins**: `http://localhost:3000` (Vite dev) and your production origin.
3. Optional redirect URIs for code flow: `http://localhost:3000/auth/google/callback`.

### Running

```bash
# Terminal 1 — API (repo root)
node server.js

# Terminal 2 — UI
npm run dev
```

Open `http://localhost:3000`. After sign-in you land on `/workspace`.

## Routes

| Path | Tab |
|------|-----|
| `/workspace` | Workspace (prompt editor + results) |
| `/workspace/analytics` | Analytics (usage summary + table) |

## Run flow

1. Choose provider and model, paste your provider API key, write a prompt.
2. Click **Run** — the proxy validates `Authorization: Bearer <VITE_PROXY_TOKEN>`, verifies the provider key, then calls the LLM with that key.
3. Invalid keys return `401` with a verification message before any completion is charged.
4. Successful runs are logged server-side; refresh **Analytics** to see updated totals.

## Build

```bash
npm run build
```

## License

MIT — see LICENSE in the repository root.
