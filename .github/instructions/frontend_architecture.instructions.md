---
description: Describe when these instructions should be loaded by the agent based on task context
# applyTo: 'Describe when these instructions should be loaded by the agent based on task context' # when provided, instructions will automatically be added to the request context when the pattern matches an attached file
---

<!-- Tip: Use /create-instructions in chat to generate content with agent assistance -->

# 🏗️ Frontend Architecture

## Folder Structure (Feature-Based)

```
src/
├── app/                    # App entry, routing, providers
│   ├── layout.tsx
│   ├── page.tsx
│   └── providers.tsx
│
├── components/             # Shared UI — Atomic Design
│   ├── ui/                 # Atoms: Button, Input, Badge, Avatar
│   ├── composed/           # Molecules: FormField, SearchBar, Stat
│   └── blocks/             # Organisms: Navbar, FeatureSection, Modal
│
├── features/               # Feature modules (self-contained)
│   └── [feature-name]/
│       ├── components/     # Feature-specific UI
│       ├── hooks/          # Feature-specific logic
│       ├── store.ts        # Local state if needed
│       ├── types.ts        # Feature types
│       └── index.ts        # Public API — export only what's needed
│
├── hooks/                  # Shared custom hooks
├── lib/                    # Utilities, API clients, helpers
├── styles/                 # Global styles, token definitions
│   ├── tokens.css          # CSS custom properties
│   └── globals.css         # Base styles
├── types/                  # Global TypeScript types
└── constants/              # App-wide constants
```

***

## Import Rules

```ts
// ✅ Use path aliases — never deep relative imports
import { Button }     from '@/components/ui/Button'
import { useAuth }    from '@/hooks/useAuth'
import { formatDate } from '@/lib/utils'

// ❌ Never do this
import { Button } from '../../../components/ui/Button'
```

***

## State Management

| Scope | Tool | Use When |
|---|---|---|
| Local UI state | `useState` / `useReducer` | Toggles, form state, local interactions |
| Shared UI state | Context API | Theme, locale, modal stack |
| Server state | TanStack Query | API data, caching, mutations |
| Global app state | Zustand / Jotai | Cross-feature state, user session |
| URL state | `useSearchParams` | Filters, pagination, tabs that should be bookmarkable |

**Rules:**
- Always prefer the smallest scope of state possible
- Server data belongs in TanStack Query — not in Redux/Zustand
- Avoid prop drilling past 2 levels — use context or state manager
- Co-locate state with the component that owns it

***

## Custom Hook Pattern

```ts
// hooks/useProjectList.ts
interface UseProjectListReturn {
  projects:   Project[]
  isLoading:  boolean
  error:      Error | null
  refetch:    () => void
  createProject: (data: CreateProjectInput) => Promise<void>
}

export function useProjectList(): UseProjectListReturn {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['projects'],
    queryFn: fetchProjects,
  })

  const mutation = useMutation({ mutationFn: createProject })

  return {
    projects:      data ?? [],
    isLoading,
    error:         error as Error | null,
    refetch,
    createProject: mutation.mutateAsync,
  }
}
```

**Rules:**
- Hooks start with `use` — always
- Return an object (not an array) unless the hook is a simple value pair like `useState`
- Typed return interfaces make autocomplete useful
- Hooks handle one concern — don't build mega-hooks

***

## API Layer

```ts
// lib/api/projects.ts — one file per resource
const BASE = '/api/v1'

export const projectsApi = {
  list:   () =>             fetch(`${BASE}/projects`).then(r => r.json()),
  get:    (id: string) =>   fetch(`${BASE}/projects/${id}`).then(r => r.json()),
  create: (body: unknown) => fetch(`${BASE}/projects`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }).then(r => r.json()),
  update: (id: string, body: unknown) => fetch(`${BASE}/projects/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }).then(r => r.json()),
  delete: (id: string) => fetch(`${BASE}/projects/${id}`, { method: 'DELETE' }),
}
```

**Rules:**
- One API module per resource
- Never call `fetch()` directly in components — always go through the API layer
- Centralize error handling (use a wrapper or interceptor)
- Type all request and response shapes

***

## TypeScript Conventions

```ts
// ✅ Prefer interfaces for object shapes
interface User {
  id:        string
  name:      string
  email:     string
  role:      UserRole
  createdAt: Date
}

// ✅ Use enums or union types for variants
type UserRole = 'admin' | 'editor' | 'viewer'

// ✅ Derive types from source of truth
type UserPreview = Pick<User, 'id' | 'name'>
type UpdateUserInput = Partial<Omit<User, 'id' | 'createdAt'>>

// ❌ Never
const user: any = {}
function handleData(data: any) {}
```

***

## Module Exports (Barrel Files)

```ts
// features/projects/index.ts — public API only
export { ProjectList }     from './components/ProjectList'
export { ProjectCard }     from './components/ProjectCard'
export { useProjectList }  from './hooks/useProjectList'
export type { Project }    from './types'

// Internal components are NOT exported
// Other features import from the index, never from internal paths
```