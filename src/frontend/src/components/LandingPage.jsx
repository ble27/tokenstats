import React, { useMemo } from 'react';
import Logo from './Logo';

const FEATURE_CARDS = [
  {
    title: 'Provider-agnostic usage',
    description: 'Normalize tokens, latency, and spend across models — without rewriting your analytics every time a new model drops.',
    meta: 'OpenAI · Anthropic · Google',
    tag: 'Usage',
    mediaLabel: 'Unified token ledger',
    tone: 'tone-emerald',
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2l3 6 6 .9-4.5 4.4 1.1 6.2L12 17l-5.6 2.9 1.1-6.2L3 8.9 9 8l3-6z" />
      </svg>
    ),
  },
  {
    title: 'Forecasting that matches reality',
    description: 'Understand run-rate and catch budget drift early with clear projections that your team can trust.',
    meta: 'Budgets · Alerts',
    tag: 'Forecast',
    mediaLabel: 'Spend runway',
    tone: 'tone-amber',
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 19V5m0 14h16M8 16l3-3 3 2 5-6" />
      </svg>
    ),
  },
  {
    title: 'Latency you can explain',
    description: 'Break down slow calls by provider, route, and prompt so performance work becomes straightforward.',
    meta: 'P50/P95 · Spikes',
    tag: 'Latency',
    mediaLabel: 'Route breakdown',
    tone: 'tone-sky',
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    title: 'Security-first key handling',
    description: 'Keys are treated as sensitive from the start — with clear UX, strong defaults, and safer workflows.',
    meta: 'Rotation · Least privilege',
    tag: 'Security',
    mediaLabel: 'Key vaults',
    tone: 'tone-rose',
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c1.7 0 3-1.3 3-3S13.7 5 12 5 9 6.3 9 8s1.3 3 3 3z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 21v-1a6 6 0 0112 0v1" />
      </svg>
    ),
  },
  {
    title: 'Complete audit trails',
    description: 'Track every API call, token usage, and request. Build accountability and observability into your AI workflows.',
    meta: 'RBAC · Audit trails',
    tag: 'Compliance',
    mediaLabel: 'Request logs',
    tone: 'tone-violet',
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 6h13M8 12h13M8 18h13" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6h.01M3 12h.01M3 18h.01" />
      </svg>
    ),
  },
  {
    title: 'Fast to adopt',
    description: 'Drop in a key, preview metrics, and iterate. No heavy setup required to get signal on day one.',
    meta: 'Minutes, not weeks',
    tag: 'Adoption',
    mediaLabel: 'Quick setup',
    tone: 'tone-cyan',
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 18l6-6-6-6" />
      </svg>
    ),
  },
];

const LandingPage = ({ onSignIn, authStatus, authError, isSignedIn, userEmail, onSignOut }) => {
  const isAuthLoading = authStatus === 'loading';
  const fallingDots = useMemo(
    () =>
      Array.from({ length: 40 }, (_, index) => ({
        id: `dot-${index}-${Math.random().toString(36).slice(2, 8)}`,
        duration: `${6 + Math.random() * 8}s`,
        delay: `${-(Math.random() * 12)}s`,
        offset: `${Math.random() * 100}%`,
        size: `${(1.6 + Math.random() * 1.8).toFixed(2)}px`,
        drift: `${(Math.random() * 90 - 45).toFixed(1)}px`,
        opacity: `${(0.55 + Math.random() * 0.35).toFixed(2)}`,
      })),
    []
  );

  return (
    <main id="top" className="relative flex min-h-screen w-full flex-col overflow-hidden">
      <div className="grid-bg" />

      <div className="falling-dots-container">
        {fallingDots.map((dot) => (
          <div
            key={dot.id}
            className="falling-dot"
            style={{
              '--fall-duration': dot.duration,
              '--fall-delay': dot.delay,
              '--horizontal-offset': dot.offset,
              '--dot-size': dot.size,
              '--dot-opacity': dot.opacity,
              '--drift': dot.drift,
            }}
          />
        ))}
      </div>

      <div className="nav-surface sticky top-0 z-50 px-4">
        <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between gap-3">
          <a className="focus-ring ml-0 rounded-lg px-2 py-1 sm:-ml-5" href="#top">
            <Logo className="text-[14px] sm:text-base" />
          </a>

          <nav className="hidden items-center gap-1 md:flex" aria-label="Primary" />

          <div className="flex flex-wrap items-center justify-end gap-2">
            {isSignedIn ? (
              <>
                <span className="hidden text-xs text-[color:var(--muted)] sm:inline">{userEmail}</span>
                <button
                  type="button"
                  onClick={onSignOut}
                  className="focus-ring rounded-full bg-[color:var(--surface)] px-3 py-1.5 text-xs sm:px-4 sm:text-sm text-[color:var(--text)] ring-1 ring-[color:var(--border)] hover:bg-[color:var(--bg-elevated)]"
                >
                  Sign out
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={onSignIn}
                  disabled={isAuthLoading}
                  className="focus-ring inline-flex rounded-full px-3 py-1.5 text-xs sm:text-sm text-[color:var(--muted)] hover:text-[color:var(--text)] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Sign in
                </button>
                <button
                  type="button"
                  onClick={onSignIn}
                  disabled={isAuthLoading}
                  className="focus-ring rounded-full bg-[color:var(--surface)] px-3 py-1.5 text-xs sm:px-4 sm:text-sm text-[color:var(--text)] ring-1 ring-[color:var(--border)] hover:bg-[color:var(--bg-elevated)] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Get started
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 pb-6 pt-10 sm:pt-14">
        <section className="relative mt-14 flex w-full flex-col items-start text-left sm:mt-20 lg:mt-24">
          <div className="hero-orbs" aria-hidden>
            <div className="hero-orb orb-1" />
            <div className="hero-orb orb-2" />
            <div className="hero-orb orb-3" />
            <div className="hero-orb orb-4" />
          </div>

          <div className="relative z-10 max-w-3xl">
            <div className="hero-frame">
              <div className="hero-rail left" />
              <div className="hero-rail right" />
              <h1 className="text-[2.6rem] font-semibold tracking-[-0.035em] text-[color:var(--text)] sm:text-6xl lg:text-[4.75rem] leading-[1.1]">
                Token analytics
                <br />
                that feel <span className="italic font-light">calm</span>
              </h1>
            </div>
          </div>

          <div className="relative z-10 mt-6 flex flex-col items-start gap-3 sm:flex-row">
            <button
              type="button"
              onClick={onSignIn}
              disabled={isAuthLoading}
              className="rounded-full bg-[color:var(--bg-elevated)] ring-1 ring-[color:var(--border)] px-6 py-2.5 text-sm font-medium text-[color:var(--text)] transition-colors hover:bg-[color:var(--surface)] focus:outline-none focus:ring-2 focus:ring-[color:var(--cta)] focus:ring-offset-2 focus:ring-offset-[color:var(--bg)] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Try now
            </button>
            <a
              href="#features"
              className="rounded-full bg-[color:var(--cta)] px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[color:var(--cta-hover)] focus:outline-none focus:ring-2 focus:ring-[color:var(--cta)] focus:ring-offset-2 focus:ring-offset-[color:var(--bg)]"
            >
              Learn more
            </a>
          </div>

          {authStatus === 'success' && isSignedIn && (
            <p className="relative z-10 mt-4 text-xs text-emerald-700">
              Signed in{userEmail ? ` as ${userEmail}` : ''}.
            </p>
          )}
          {authStatus === 'error' && authError && (
            <p className="relative z-10 mt-4 text-xs text-rose-600">{authError}</p>
          )}
        </section>

        <section className="mt-32 w-full" id="features">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURE_CARDS.map((feature) => (
              <article key={feature.title} className={`feature-card ${feature.tone}`}>
                <div className="feature-media">
                  <div className="flex items-center justify-between">
                    <span className="feature-chip">{feature.tag}</span>
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[color:var(--surface)] text-[color:var(--text)] ring-1 ring-[color:var(--border)]">
                      {feature.icon}
                    </div>
                  </div>
                  <p className="mt-10 text-sm text-[color:var(--muted-2)]">{feature.mediaLabel}</p>
                </div>
                <div className="feature-body">
                  <p className="feature-meta">{feature.meta}</p>
                  <h3 className="feature-title">{feature.title}</h3>
                  <p className="feature-desc">{feature.description}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-auto w-full pt-16">
          <div className="glass-card strong flex flex-col items-start justify-between gap-6 p-8 sm:p-10 lg:flex-row lg:items-center">
            <div className="max-w-xl">
              <p className="text-xs uppercase tracking-[0.22em] text-[color:var(--muted-2)]">Get started</p>
              <p className="mt-3 text-base text-[color:var(--muted)]">
                Launch your workspace in minutes and keep every model accountable.
              </p>
            </div>
            <div className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto">
              <button
                type="button"
                onClick={onSignIn}
                disabled={isAuthLoading}
                className="focus-ring w-full rounded-full bg-[color:var(--cta)] px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[color:var(--cta-hover)] sm:w-auto disabled:cursor-not-allowed disabled:opacity-70"
              >
                Start now
              </button>
            </div>
          </div>

          <footer className="mt-6 mb-0 flex flex-col items-center justify-between gap-3 border-t border-black/10 pt-6 text-sm text-[color:var(--muted-2)] sm:flex-row">
            <span>© {new Date().getFullYear()} Tokenstats</span>
            <div className="flex items-center gap-4">
              <a className="focus-ring rounded-full px-2 py-1 hover:text-[color:var(--text)]" href="#features">
                Features
              </a>
              <button
                type="button"
                onClick={onSignIn}
                disabled={isAuthLoading}
                className="focus-ring rounded-full px-2 py-1 hover:text-[color:var(--text)] disabled:cursor-not-allowed disabled:opacity-70"
              >
                Get started
              </button>
            </div>
          </footer>
        </section>
      </div>
    </main>
  );
};

export default LandingPage;
