import React, { useMemo, useState } from 'react';
import ApiKeyInput from './ApiKeyInput';
import ProviderSelection from './ProviderSelection';
import Logo from './Logo';

const LandingPage = () => {
  const [provider, setProvider] = useState('');
  const [apiKey, setApiKey] = useState('');

  const providers = useMemo(() => ['OpenAI', 'Anthropic', 'Google'], []);
  const hasValidKey = apiKey.length >= 10;

  const features = useMemo(
    () => [
      {
        title: 'Provider-agnostic usage',
        description: 'Normalize tokens, latency, and spend across models — without rewriting your analytics every time a new model drops.',
        meta: 'OpenAI · Anthropic · Google',
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
        icon: (
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 18l6-6-6-6" />
          </svg>
        ),
      },
    ],
    []
  );

  return (
    <main className="relative w-full overflow-hidden">
      <div className="grid-bg" />
      <div className="pointer-events-none absolute -top-48 right-[-220px] h-[560px] w-[560px] rounded-full bg-[radial-gradient(circle,rgba(79,70,229,0.22),transparent_68%)] blur-3xl opacity-80" />
      <div className="pointer-events-none absolute bottom-[-220px] left-[-220px] h-[560px] w-[560px] rounded-full bg-[radial-gradient(circle,rgba(6,182,212,0.18),transparent_70%)] blur-3xl opacity-80" />

      <div className="sticky top-0 z-50 border-b border-black/10 bg-[color:var(--bg)]/75 px-4 backdrop-blur supports-[backdrop-filter]:bg-[color:var(--bg)]/60">
        <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between gap-3">
          <a className="focus-ring -ml-2 rounded-lg px-2 py-1" href="#">
            <Logo className="text-[15px] sm:text-base" />
          </a>

          <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
            <a
              className="focus-ring rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-black/5 hover:text-slate-950"
              href="#features"
            >
              Features
            </a>
            <a
              className="focus-ring rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-black/5 hover:text-slate-950"
              href="#insights"
            >
              Insights
            </a>
          </nav>

          <div className="flex items-center gap-2">
            <a className="cta-secondary focus-ring hidden sm:inline-flex" href="#connect">
              Sign in
            </a>
            <a className="cta-primary focus-ring" href="#connect">
              Get started
            </a>
          </div>
        </div>
      </div>

      <div className="relative z-10 mx-auto w-full max-w-6xl px-4 pb-20 pt-10 sm:pt-14">

        <section className="relative mt-10 grid items-start gap-10 lg:grid-cols-[1.08fr_0.92fr] sm:mt-14">
          <div className="hero-fall" aria-hidden />
          <div className="relative text-center lg:text-left">
            <h1 className="display-serif text-5xl font-bold leading-[0.95] text-[color:var(--text)] sm:text-6xl lg:text-7xl">
              Token analytics that <span className="underline-accent">feels calm</span>.
            </h1>
            <p className="mt-5 text-base text-[color:var(--muted)] sm:text-lg">
              Track input/output tokens, latency, and spend across providers from one dashboard — designed for teams who
              want clarity without noise.
            </p>

            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start">
              <a className="cta-primary focus-ring w-full sm:w-auto" href="#connect">
                Start tracking
              </a>
              <a className="cta-secondary focus-ring w-full sm:w-auto" href="#features">
                Explore features
              </a>
            </div>

            <div className="mt-7 flex flex-col items-center justify-center gap-4 text-sm text-[color:var(--muted-2)] sm:flex-row lg:justify-start">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[var(--accent-3)] shadow-[0_0_10px_rgba(22,163,74,0.35)]" />
                <span>99.99% uptime</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="h-4 w-4 text-emerald-700" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>SOC 2-ready workflows</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="h-4 w-4 text-slate-700" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Seconds to integrate</span>
              </div>
            </div>
          </div>

          <div className="glass-card float-slow relative overflow-hidden p-6 sm:p-8">
            <div className="pointer-events-none absolute -right-24 -top-24 h-52 w-52 rounded-full bg-[radial-gradient(circle,rgba(79,70,229,0.18),transparent_70%)] blur-2xl" />
            <div className="relative flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-[color:var(--muted-2)]">Live usage</p>
                <p className="mt-2 text-3xl font-semibold text-[color:var(--text)]">82,401</p>
                <p className="text-xs text-emerald-700">+12% since yesterday</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full border border-black/10 bg-white/60">
                <div className="h-2 w-2 animate-pulse rounded-full bg-emerald-600" />
              </div>
            </div>

            <div className="relative mt-6 grid grid-cols-2 gap-4">
              <div className="rounded-2xl border border-black/10 bg-white/70 p-4">
                <p className="text-xs text-[color:var(--muted-2)]">Input tokens</p>
                <p className="mt-2 text-xl font-semibold text-[color:var(--text)]">412K</p>
              </div>
              <div className="rounded-2xl border border-black/10 bg-white/70 p-4">
                <p className="text-xs text-[color:var(--muted-2)]">Output tokens</p>
                <p className="mt-2 text-xl font-semibold text-[color:var(--text)]">268K</p>
              </div>
              <div className="rounded-2xl border border-black/10 bg-white/70 p-4">
                <p className="text-xs text-[color:var(--muted-2)]">Avg. latency</p>
                <p className="mt-2 text-xl font-semibold text-[color:var(--text)]">1.2s</p>
              </div>
              <div className="rounded-2xl border border-black/10 bg-white/70 p-4">
                <p className="text-xs text-[color:var(--muted-2)]">Spend</p>
                <p className="mt-2 text-xl font-semibold text-[color:var(--text)]">$3.41</p>
              </div>
            </div>

            <div className="relative mt-6 space-y-3">
              <div className="flex items-center justify-between text-xs text-[color:var(--muted-2)]">
                <span>Forecast</span>
                <span className="font-medium text-[color:var(--text)]">$14.28</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-black/5">
                <div className="h-full w-2/3 rounded-full bg-gradient-to-r from-[var(--accent)] to-[var(--accent-2)]" />
              </div>
            </div>
          </div>
        </section>

        <section className="mt-16 w-full" id="features">
          <div className="relative overflow-hidden rounded-3xl bg-[#07080c] ring-1 ring-white/10">
            <div className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[820px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(79,70,229,0.26),transparent_70%)] blur-3xl" />
            <div className="relative px-6 py-12 sm:px-10">
              <div className="grid items-end gap-6 md:grid-cols-[1fr_1fr]">
                <div>
                  <h2 className="display-serif text-4xl font-bold leading-tight text-white sm:text-5xl">
                    Everything you need to track.
                  </h2>
                  <p className="mt-3 text-base text-white/70">
                    From token usage to latency to cost — see the full picture of your AI infrastructure.
                  </p>
                </div>
                <div className="md:justify-self-end">
                  <div className="inline-flex flex-wrap items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/70">
                    <span className="font-medium text-white">Works with</span>
                    <span className="rounded-lg border border-white/10 bg-white/5 px-2 py-1">OpenAI</span>
                    <span className="rounded-lg border border-white/10 bg-white/5 px-2 py-1">Anthropic</span>
                    <span className="rounded-lg border border-white/10 bg-white/5 px-2 py-1">Google</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {features.map((feature) => (
                  <div key={feature.title} className="glass-card dark p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1">
                        <div className="text-[0.72rem] uppercase tracking-[0.22em] text-white/60">{feature.meta}</div>
                        <h3 className="text-lg font-semibold text-white">{feature.title}</h3>
                      </div>
                      <div className="icon-chip dark text-white">{feature.icon}</div>
                    </div>
                    <p className="mt-3 text-sm leading-relaxed text-white/70">{feature.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="mt-16 grid w-full gap-8 lg:grid-cols-[1fr_1fr]" id="insights">
          <div className="space-y-6">
            <div>
              <h2 className="display-serif text-4xl leading-tight text-[color:var(--text)] sm:text-5xl">
                Spend, performance, context — together.
              </h2>
              <p className="mt-3 text-base text-[color:var(--muted)]">
                Token Stats blends clear reporting, proactive insights, and security-first controls. Build confidence for
                every prompt in production.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="glass-card p-5">
                <p className="text-sm font-semibold text-[color:var(--text)]">Realtime budgets</p>
                <p className="mt-2 text-sm text-[color:var(--muted)]">Hard limits or soft alerts by project.</p>
              </div>
              <div className="glass-card p-5">
                <p className="text-sm font-semibold text-[color:var(--text)]">Prompt lineage</p>
                <p className="mt-2 text-sm text-[color:var(--muted)]">Trace every call back to its source.</p>
              </div>
              <div className="glass-card p-5">
                <p className="text-sm font-semibold text-[color:var(--text)]">Latency breakdowns</p>
                <p className="mt-2 text-sm text-[color:var(--muted)]">Spot provider spikes and regressions fast.</p>
              </div>
              <div className="glass-card p-5">
                <p className="text-sm font-semibold text-[color:var(--text)]">Private by default</p>
                <p className="mt-2 text-sm text-[color:var(--muted)]">Safer key workflows from the start.</p>
              </div>
            </div>
          </div>

          <div className="glass-card strong space-y-6 p-6 sm:p-8" id="connect">
            <div>
              <div className="badge w-fit">Quick setup</div>
              <h3 className="display-serif mt-3 text-3xl leading-tight text-[color:var(--text)]">Connect a provider</h3>
              <p className="mt-2 text-sm text-[color:var(--muted)]">
                Paste a key to preview metrics instantly. Disconnect anytime.
              </p>
            </div>

            <div className="grid gap-4">
              <ProviderSelection providers={providers} onSelectProvider={setProvider} />
              <ApiKeyInput onApiKeyChange={setApiKey} />
            </div>

            <div className="rounded-2xl border border-black/10 bg-white/70 px-4 py-3 text-sm text-[color:var(--muted)]">
              <span className="font-medium text-[color:var(--text)]">
                {provider ? `Selected: ${provider}` : 'Select a provider to continue.'}
              </span>
              <span className="ml-2 text-[color:var(--muted-2)]">
                {hasValidKey ? `Key looks good (${apiKey.length} chars)` : 'Add a key to validate.'}
              </span>
            </div>

            <button className="cta-primary focus-ring w-full">Securely connect</button>
            <p className="text-xs text-[color:var(--muted-2)]">
              Keys never leave your control and are always encrypted on ingest.
            </p>
          </div>
        </section>

        <section className="mt-16 w-full">
          <div className="glass-card strong flex flex-col items-start justify-between gap-6 p-8 sm:p-10 lg:flex-row lg:items-center">
            <div className="max-w-xl">
              <p className="text-xs uppercase tracking-[0.22em] text-[color:var(--muted-2)]">Get started</p>
              <p className="mt-3 text-base text-[color:var(--muted)]">
                Launch your workspace in minutes and keep every model accountable.
              </p>
            </div>
            <div className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto">
              <a className="cta-primary focus-ring w-full text-center sm:w-auto" href="#connect">
                Start now
              </a>
              <a className="cta-secondary focus-ring w-full text-center sm:w-auto" href="#connect">
                Talk to us
              </a>
            </div>
          </div>

          <footer className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-black/10 pt-8 text-sm text-[color:var(--muted-2)] sm:flex-row">
            <span>© {new Date().getFullYear()} Token Stats</span>
            <div className="flex items-center gap-4">
              <a className="focus-ring rounded-full px-2 py-1 hover:text-[color:var(--text)]" href="#features">
                Features
              </a>
              <a className="focus-ring rounded-full px-2 py-1 hover:text-[color:var(--text)]" href="#connect">
                Get started
              </a>
            </div>
          </footer>
        </section>
      </div>
    </main>
  );
};

export default LandingPage;
