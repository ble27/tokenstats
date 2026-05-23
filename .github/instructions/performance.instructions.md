---
description: Describe when these instructions should be loaded by the agent based on task context
# applyTo: 'Describe when these instructions should be loaded by the agent based on task context' # when provided, instructions will automatically be added to the request context when the pattern matches an attached file
---

<!-- Tip: Use /create-instructions in chat to generate content with agent assistance -->

# ⚡ Performance Standards

## Targets

| Metric | Target | Critical Threshold |
|---|---|---|
| LCP (Largest Contentful Paint) | < 2.5s | > 4s = fail |
| INP (Interaction to Next Paint) | < 200ms | > 500ms = fail |
| CLS (Cumulative Layout Shift) | < 0.1 | > 0.25 = fail |
| Initial JS bundle | < 200KB gzipped | > 500KB = fail |
| Total page weight | < 1.5MB | — |
| Time to Interactive | < 3.5s | — |

***

## Images (Biggest Win)

```tsx
// ✅ Every image — lazy, sized, modern format
<img
  src="hero.webp"
  alt="Product dashboard overview"
  width={1280}
  height={720}
  loading="lazy"
  decoding="async"
  fetchpriority="low"
/>

// ✅ Above-the-fold hero — eager + high priority
<img
  src="hero.webp"
  alt="..."
  width={1280}
  height={720}
  loading="eager"
  fetchpriority="high"
/>

// ✅ Responsive images with srcset
<img
  src="card.webp"
  srcset="card-400.webp 400w, card-800.webp 800w, card-1200.webp 1200w"
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px"
  alt="..."
  width={400}
  height={300}
  loading="lazy"
/>
```

**Rules:**
- Always set `width` and `height` to prevent layout shift (CLS)
- WebP for photos, SVG for icons/logos, AVIF when supported
- Hero/above-fold images: `loading="eager" fetchpriority="high"`
- Every other image: `loading="lazy" decoding="async"`
- Use `<picture>` for art direction or format fallbacks

***

## JavaScript

```tsx
// ✅ Code split at the route level (Next.js / React Router)
const Dashboard = lazy(() => import('./pages/Dashboard'))
const Settings  = lazy(() => import('./pages/Settings'))

// ✅ Lazy load heavy components
const RichEditor = lazy(() => import('./components/RichEditor'))
const ChartModal = lazy(() => import('./components/ChartModal'))

// ✅ Dynamic imports for heavy one-time operations
async function exportToPdf() {
  const { jsPDF } = await import('jspdf')
  // ...
}
```

**Bundle rules:**
- All scripts: `defer` or `type="module"` — never blocking
- Tree-shake: import named exports, not entire libraries
  - ✅ `import { format } from 'date-fns'`
  - ❌ `import * as dateFns from 'date-fns'`
- Audit with `npm run build -- --analyze` before shipping
- Third-party scripts (analytics, chat widgets): load after TTI

***

## React-Specific

```tsx
// ✅ Memoize expensive calculations
const sortedProjects = useMemo(
  () => projects.sort((a, b) => b.updatedAt - a.updatedAt),
  [projects]
)

// ✅ Stable callbacks to prevent child re-renders
const handleSelect = useCallback(
  (id: string) => setSelectedId(id),
  [] // only recreate if deps change
)

// ✅ Virtualize long lists
import { useVirtualizer } from '@tanstack/react-virtual'

// ❌ Don't over-memoize — measure first
// useMemo on a simple filter of 10 items is noise
```

**Rules:**
- Profile before optimizing — React DevTools Profiler first
- `useMemo` / `useCallback` only for proven bottlenecks or stable reference requirements
- Virtualize lists > 50–100 rows with `@tanstack/react-virtual`
- Avoid `useEffect` for derived state — compute during render
- Key prop must be stable and unique — never array index for dynamic lists

***

## CSS Performance

```css
/* ✅ Use content-visibility for long off-screen sections */
.card-grid-item {
  content-visibility: auto;
  contain-intrinsic-size: 0 300px; /* estimated height */
}

/* ✅ will-change only when you KNOW animation is coming */
.modal-entering {
  will-change: transform, opacity;
}

/* ✅ GPU-accelerated properties only */
/* Animate: transform, opacity */
/* Never animate: width, height, top, left, margin, padding */
.card {
  transition: transform 180ms ease, opacity 180ms ease;
}
.card:hover {
  transform: translateY(-2px);
}
```

***

## Fonts

```html
<!-- ✅ Preconnect to font origins -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>

<!-- ✅ font-display: swap prevents invisible text -->
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400..700&display=swap" rel="stylesheet">
```

```css
/* ✅ System font fallback prevents layout shift while font loads */
body {
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
}
```

**Rules:**
- `font-display: swap` on all custom fonts
- Preconnect to font CDN origins
- Load only weights you use — prefer variable fonts (`wght@300..700`)
- Max 2 font families, max 4 weight variants

***

## Data Fetching

```tsx
// ✅ Parallel fetches — don't waterfall
const [user, projects] = await Promise.all([
  fetchUser(userId),
  fetchProjects(userId),
])

// ✅ Optimistic updates for instant UI feel
const mutation = useMutation({
  mutationFn: updateProject,
  onMutate: async (updated) => {
    await queryClient.cancelQueries({ queryKey: ['projects'] })
    const previous = queryClient.getQueryData(['projects'])
    queryClient.setQueryData(['projects'], (old) =>
      old.map(p => p.id === updated.id ? { ...p, ...updated } : p)
    )
    return { previous }
  },
  onError: (_err, _vars, context) => {
    queryClient.setQueryData(['projects'], context.previous)
  },
})

// ✅ Cache aggressively, invalidate precisely
queryClient.invalidateQueries({ queryKey: ['projects', projectId] })
```

***

## Performance Checklist

- [ ] All images have `width`, `height`, `loading`, `decoding` set
- [ ] Hero image: `loading="eager" fetchpriority="high"`
- [ ] Images in WebP or AVIF format
- [ ] No render-blocking scripts — all `defer` or `type="module"`
- [ ] Tree-shaking verified — named imports only
- [ ] Routes code-split with `React.lazy()`
- [ ] Heavy third-party libs loaded dynamically on demand
- [ ] `font-display: swap` + preconnect on all font CDNs
- [ ] Lists > 100 rows virtualized
- [ ] Only `transform` and `opacity` animated (no layout thrashing)
- [ ] Parallel data fetching — no unnecessary waterfalls
- [ ] `content-visibility: auto` on long off-screen sections
- [ ] Bundle analyzed before major releases