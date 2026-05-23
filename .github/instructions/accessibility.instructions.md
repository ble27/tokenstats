---
description: Describe when these instructions should be loaded by the agent based on task context
# applyTo: 'Describe when these instructions should be loaded by the agent based on task context' # when provided, instructions will automatically be added to the request context when the pattern matches an attached file
---

<!-- Tip: Use /create-instructions in chat to generate content with agent assistance -->

# ✅ Code Quality & Review Standards

## The Prime Directive

> Code is read far more than it is written.
> Optimize for the next developer who reads it — including future you.

***

## Naming

| Type | Convention | Examples |
|---|---|---|
| Variables & functions | `camelCase` | `getUserById`, `isLoading`, `projectList` |
| Components | `PascalCase` | `ProjectCard`, `NavBar`, `AuthModal` |
| Constants | `SCREAMING_SNAKE_CASE` | `MAX_RETRIES`, `DEFAULT_PAGE_SIZE` |
| CSS classes & tokens | `kebab-case` | `btn-primary`, `text-muted`, `card-surface` |
| Files (components) | `PascalCase.tsx` | `ProjectCard.tsx`, `AuthModal.tsx` |
| Files (hooks/utils) | `camelCase.ts` | `useProjectList.ts`, `formatDate.ts` |
| Test files | Match source | `ProjectCard.test.tsx` |

**Rules:**
- Names describe intent, not implementation: `getUserById` not `fetchData`
- Boolean names start with `is`, `has`, `can`, `should`: `isLoading`, `hasPermission`
- Event handlers use `handle` prefix: `handleSubmit`, `handleClose`
- No abbreviations unless universally understood (`id`, `url`, `api`, `db`)

***

## Function Design

```ts
// ✅ One responsibility, clear name, typed
async function fetchUserById(id: string): Promise<User> {
  const response = await usersApi.get(id)
  if (!response.ok) throw new ApiError(response.status, `User ${id} not found`)
  return response.json()
}

// ❌ Vague name, multiple responsibilities, untyped
async function getData(x: any) {
  const r = await fetch(`/api/users/${x}`)
  const d = await r.json()
  setUser(d)
  trackEvent('user_loaded')
  return d
}
```

**Rules:**
- Max ~20 lines per function — if longer, decompose
- Max 3 parameters — use an options object for more
- Return early to avoid deep nesting (guard clauses)
- Pure functions when possible — no hidden side effects
- No mixing data fetching + UI state + analytics in one function

***

## Component Rules

```tsx
// ✅ Clean, focused, typed
interface ProjectCardProps {
  project:   Project
  onSelect?: (id: string) => void
  variant?:  'default' | 'compact'
}

export function ProjectCard({ project, onSelect, variant = 'default' }: ProjectCardProps) {
  return (
    <article className={`card card--${variant}`} onClick={() => onSelect?.(project.id)}>
      <h3 className="card__title">{project.name}</h3>
      <p  className="card__description">{project.description}</p>
    </article>
  )
}
```

**Rules:**
- One component per file — always
- Props interface named `[Component]Props` and defined above the component
- Destructure props in the function signature
- Default values in destructuring, not inside the function body
- No logic in JSX — extract to variables or helper functions before the return

***

## Error Handling

```ts
// ✅ Explicit, user-friendly errors
try {
  const user = await fetchUserById(id)
  setUser(user)
} catch (error) {
  if (error instanceof ApiError && error.status === 404) {
    setError('User not found. They may have been deleted.')
  } else {
    setError('Something went wrong. Please try again.')
    reportError(error) // send to Sentry/logging
  }
}
```

**Rules:**
- Never swallow errors silently with an empty `catch` block
- Distinguish user-facing messages from developer logs
- Typed error classes over raw `Error` for recoverable cases
- Always have a fallback UI for error states — no blank screens

***

## Comments

```ts
// ✅ Explain WHY, not WHAT
// Delay retry to avoid hammering the API during a 503 storm
await sleep(backoffMs * attempt)

// ❌ States the obvious
// Loop through the array
for (const item of items) { ... }

// ✅ Link to external context when the code is non-obvious
// Workaround for Safari < 16.4 subgrid support: https://caniuse.com/css-subgrid
.grid { display: grid; }
```

**Rules:**
- Comments explain intent and reasoning, not mechanics
- Complex algorithms get a brief explanation + link to the approach
- Delete commented-out code — use git history instead
- JSDoc for public API functions and exported types

***

## Git & Commits

```
feat(projects): add project archiving with undo
fix(auth): correct token refresh race condition
refactor(ui): extract reusable Stat component from Dashboard
chore(deps): bump Tailwind to 4.1.2
test(projects): add missing edge cases for createProject
```

**Rules:**
- Conventional Commits format: `type(scope): description`
- One logical change per commit — don't bundle unrelated fixes
- PR titles match the squash commit message
- Branch names: `feat/project-archiving`, `fix/token-refresh`, `refactor/stat-component`

***

## Code Review Checklist

Before approving or submitting a PR:

**Correctness**
- [ ] Logic handles edge cases (empty arrays, null values, network failure)
- [ ] No race conditions or stale closures in async code
- [ ] Error states are handled and surfaced to the user

**Code Quality**
- [ ] Functions and variables are named clearly
- [ ] No function exceeds ~20 lines without a good reason
- [ ] No duplicate logic that could be a shared utility

**Types**
- [ ] No `any` types introduced
- [ ] All new props and API responses are typed

**UI (if applicable)**
- [ ] Component works at 375px and 1280px
- [ ] Interactive states (hover, focus, disabled) are handled
- [ ] No hardcoded colors, spacing, or font sizes
- [ ] Dark mode still works

**Tests**
- [ ] New logic has unit tests
- [ ] Existing tests pass

**Performance**
- [ ] No unnecessary re-renders introduced
- [ ] Heavy operations are memoized or deferred if needed