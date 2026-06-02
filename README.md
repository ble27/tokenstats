# Token Stats

tokenstats is a full-stack web app for **tracking LLM usage in one place**: run prompts against multiple providers, see token counts, latency, estimated cost, and aggregated analytics over time. Provider API keys are entered in the browser for each session (not stored in the database). Google sign-in is used only to gate access to the workspace UI.

You can run it locally for development and testing, publish the source on GitHub as open source, and deploy a hosted version later—the license of your code does not prevent you from running a public site. Just keep secrets out of the repo and use environment variables in production.

---

## What it does

| Area | Capability |
|------|------------|
| **Landing** | Marketing page, Google sign-in, light/dark theme |
| **Workspace** | Choose provider (OpenAI, Groq, Anthropic, Gemini, Perplexity), model, paste API key, run prompts |
| **Results** | Live response text, input/output tokens, latency, estimated spend |
| **Analytics** | Totals and breakdown by provider/model; filter by time range; optional log cleanup |
| **Backend proxy** | Validates a shared proxy token, verifies provider keys, calls LLM APIs, logs runs to SQLite |

---

## Architecture (data flow)

```text
Browser (React)
  │
  ├─ Google OAuth ──► Google (identity for UI only; session in localStorage)
  │
  └─ fetch + Authorization: Bearer <PROXY_AUTH_TOKEN>
        │
        ▼
      Express API (src/backend)
        ├─ verifyProxyToken middleware
        ├─ POST /v1/chat  → provider adapter → LLM vendor API
        │                    └─► Prisma → SQLite file (local) or Turso (production)
        └─ GET/DELETE /v1/analytics → aggregated logs
```

**Shared config:** `pricing.json` at the repo root drives model lists in the UI and cost estimation on the server.

**Security model (important for testers):**

- `PROXY_AUTH_TOKEN` — shared secret between frontend and your API (required on every `/v1/*` call).
- Provider API keys — sent per request from the UI; verified before the LLM call; not persisted in the DB.
- Optional provider keys in server `.env` — only if you want server-side defaults; not required for normal UI flow.

---

## Repository layout

```text
token_tracker/
├── README.md                 # This file
├── Dockerfile                # Backend API image
├── Dockerfile.frontend       # Frontend build + nginx image
├── docker-compose.yml        # Run API + web together for local testing
├── docker/
│   ├── nginx.conf            # SPA fallback to index.html
│   └── entrypoint-backend.sh # Prisma migrate, then start API
├── .env.example              # Backend env template (repo root)
├── .env.docker.example       # Env template for Docker Compose
├── pricing.json              # Model pricing + IDs (frontend + backend)
├── package.json              # Backend dependencies + npm scripts
├── prisma/
│   ├── schema.prisma         # TokenLog model (SQLite / Turso libSQL)
│   └── migrations/           # Database migrations
└── src/
    ├── frontend/             # React + Vite app
    │   ├── index.html        # HTML shell
    │   ├── vite.config.js    # Dev server (port 3000), VITE_* env prefix
    │   ├── tailwind.config.js
    │   ├── postcss.config.js
    │   ├── package.json      # Frontend dependencies
    │   ├── .env.example      # VITE_GOOGLE_CLIENT_ID, VITE_API_BASE, VITE_PROXY_TOKEN
    │   └── src/
    │       ├── main.jsx      # React entry → mounts App
    │       ├── App.jsx       # Routes: landing, Google callback, dashboard
    │       ├── index.css     # Global theme tokens + components
    │       ├── styles/
    │       │   └── dashboard.css   # Workspace/analytics layout styles
    │       ├── layouts/
    │       │   └── DashboardLayout.jsx  # Shell: nav + header + tab content
    │       ├── hooks/
    │       │   ├── useGoogleSignIn.js   # Google login, session, popup messages
    │       │   ├── usePromptRun.js      # Run prompt → /v1/chat
    │       │   ├── useAnalytics.js      # Load/delete analytics
    │       │   ├── useWorkspaceTab.js   # Workspace vs analytics tab + URL
    │       │   └── useResizablePane.js  # Resizable editor/results split
    │       ├── lib/
    │       │   ├── env.js             # VITE_API_BASE, VITE_PROXY_TOKEN helpers
    │       │   ├── googleAuth.js      # Profile fetch, session storage, OAuth hash
    │       │   ├── navigation.js      # pushState paths (/workspace, /analytics)
    │       │   ├── providerConfig.js  # Provider labels, default models
    │       │   ├── formatters.js      # Numbers/currency display
    │       │   └── api/
    │       │       ├── chatClient.js      # POST /v1/chat
    │       │       └── analyticsClient.js # GET/DELETE /v1/analytics
    │       └── components/
    │           ├── LandingPage.jsx
    │           ├── GoogleAuthCallback.jsx  # OAuth redirect handler
    │           ├── Login.jsx               # Re-export / legacy entry
    │           ├── Logo.jsx
    │           ├── PromptWorkspace.jsx     # Re-export DashboardLayout
    │           ├── ProviderSelection.jsx
    │           ├── ApiKeyInput.jsx
    │           ├── dashboard/
    │           │   ├── WorkspaceNav.jsx    # Tab switcher
    │           │   └── DashboardHeader.jsx
    │           ├── workspace/
    │           │   ├── WorkspaceView.jsx       # Main prompt UI
    │           │   ├── WorkspaceToolbar.jsx    # Provider/model selects
    │           │   ├── ProviderCredentials.jsx
    │           │   ├── PromptEditor.jsx
    │           │   ├── ResultsPanel.jsx
    │           │   └── RunStatusBar.jsx
    │           ├── analytics/
    │           │   ├── AnalyticsView.jsx
    │           │   ├── AnalyticsSummary.jsx
    │           │   └── AnalyticsTable.jsx
    │           ├── shared/
    │           │   └── ApiKeyField.jsx
    │           └── ui/
    │               └── dashboard-select.jsx
    └── backend/              # Express API
        ├── server.js         # App entry, mounts routes + middleware
        ├── middleware/
        │   ├── verifyProxyToken.js  # Bearer PROXY_AUTH_TOKEN check
        │   └── rateLimiter.js       # Basic rate limiting
        ├── routes/
        │   ├── chat.js         # POST / — LLM call + DB log
        │   └── analytics.js    # GET/DELETE — aggregates from TokenLog
        ├── adapters/
        │   ├── openaiAdapter.js
        │   ├── groqAdapter.js
        │   ├── anthropicAdapter.js
        │   ├── geminiAdapter.js
        │   └── perplexityAdapter.js
        ├── lib/
        │   ├── prisma.js            # Prisma client (file SQLite or Turso adapter)
        │   └── geminiConstants.js   # Gemini free vs paid tier model sets
        └── utils/
            ├── calculateCost.js    # Reads pricing.json
            └── verifyProviderKey.js # Format/live check per provider
```

---

## Prerequisites

- **Node.js** 20+ and npm
- **Google Cloud** OAuth 2.0 Web client ([Credentials](https://console.cloud.google.com/apis/credentials)) with authorized JavaScript origins for your dev URL (e.g. `http://localhost:3000`)
- **Provider API keys** for any models you want to test (paste in the Workspace UI)
- **Docker** (optional) — Docker Engine + Docker Compose v2

---

## Run locally (recommended for development)

### 1. Install dependencies

```bash
# Backend (repo root)
npm install

# Frontend
npm install --prefix src/frontend
```

### 2. Configure environment

**Backend** — copy and edit at repo root:

```bash
cp .env.example .env
```

Set at minimum:

```env
PROXY_AUTH_TOKEN=your_long_random_secret
DATABASE_URL="file:./dev.db"
```

**Production (Turso):** set `TURSO_DATABASE_URL` + `TURSO_AUTH_TOKEN` (keep `DATABASE_URL` as `file:./dev.db`). Run `npm run db:migrate:turso`. See **[docs/DEPLOY.md](docs/DEPLOY.md)**.

**Frontend** — copy and edit:

```bash
cp src/frontend/.env.example src/frontend/.env.local
```

Set:

```env
VITE_GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
VITE_API_BASE=http://127.0.0.1:3001
VITE_PROXY_TOKEN=your_long_random_secret
```

`VITE_PROXY_TOKEN` must match `PROXY_AUTH_TOKEN` exactly.

### 3. Database

```bash
npm run db:migrate
npm run db:verify   # optional: create/delete test row
```

### 4. Start both processes

In two terminals:

```bash
npm run dev:backend    # http://127.0.0.1:3001
npm run dev:frontend   # http://localhost:3000
```

### 5. Manual test checklist

1. Open `http://localhost:3000` — landing page loads.
2. Sign in with Google — you should land on `/workspace`.
3. Select a provider and model, paste a valid API key, enter a short prompt, click **Run**.
4. Confirm response, token counts, and latency appear.
5. Open the **Analytics** tab — a new row should appear after a successful run.
6. Sign out — you should return to the landing page.

**Troubleshooting**

| Symptom | Check |
|--------|--------|
| `401 Unauthorized` on API calls | `VITE_PROXY_TOKEN` ↔ `PROXY_AUTH_TOKEN` mismatch; restart Vite after changing `.env.local` |
| Cannot reach API | Backend running on 3001; `VITE_API_BASE` matches |
| Google sign-in fails | Client ID, authorized origins, and redirect URI (if using callback route) |
| Empty analytics | Run at least one successful chat first |

---

## Run with Docker (local integration test)

Docker is useful to verify the **production-like** split: static frontend + API container. It is not a substitute for configuring real Google OAuth and provider keys.

```bash
cp .env.docker.example .env
# Edit .env: PROXY_AUTH_TOKEN, VITE_GOOGLE_CLIENT_ID, etc.

docker compose up --build
```

| Service | URL |
|---------|-----|
| Web UI | http://localhost:3000 |
| API | http://localhost:3001 |

Stop:

```bash
docker compose down
# docker compose down -v   # also remove SQLite volume
```

**Note:** `VITE_*` variables are embedded at **frontend image build time**. If you change them, rebuild: `docker compose build web`.

SQLite data persists in the `sqlite_data` Docker volume.

---

## npm scripts (repo root)

| Script | Description |
|--------|-------------|
| `npm run dev:backend` | Start Express API |
| `npm run dev:frontend` | Start Vite dev server |
| `npm run build:frontend` | Production build → `src/frontend/dist` |
| `npm run db:migrate` | Apply migrations (local `file:` DB only) |
| `npm run db:migrate:turso` | Apply migrations to Turso |
| `npm run db:verify` | Smoke-test DB read/write |
| `npm run db:studio` | Open Prisma Studio (inspect DB) |
| `npm run docker:up` | `docker compose up --build` |
| `npm run docker:down` | `docker compose down` |

---

## API overview (for testers)

All `/v1/*` routes require:

```http
Authorization: Bearer <PROXY_AUTH_TOKEN>
```

| Method | Path | Purpose |
|--------|------|---------|
| `POST` | `/v1/chat` | Run a prompt (`provider`, `model`, `messages`, `apiKey`) |
| `GET` | `/v1/analytics?range=1d\|1w\|1m\|all` | Aggregated usage |
| `DELETE` | `/v1/analytics?range=...` | Delete logs in range |

---

## Production deploy

**Vercel** (frontend) + **Turso** (database) + **Node host** (API: Render, Railway, Fly without volume, etc.)

Step-by-step: **[docs/DEPLOY.md](docs/DEPLOY.md)** · Env reference: **[docs/ENV.md](docs/ENV.md)**

---

## License

MIT License

Copyright (c) [2026] [Bao Le]

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.