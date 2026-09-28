import { ThemeToggle } from "@/components/theme-toggle";
import Link from "next/link";

const CODE_LINES = [
  { cls: "code-comment", text: "// RepoLens — AI Codebase Analysis" },
  { cls: "code-key", text: 'repository.connect("github.com/you/app")' },
  { cls: "", text: "" },
  { cls: "code-ok", text: "→ reading files.............. done" },
  { cls: "code-ok", text: "→ detecting framework........ Next.js" },
  { cls: "code-ok", text: "→ building code knowledge.... 148 chunks" },
  { cls: "code-ok", text: "→ running analysis........... ok" },
  { cls: "code-ok", text: "→ generating report.......... ready" },
  { cls: "", text: "" },
  { cls: "code-key", text: "health.score = 82" },
  { cls: "code-key", text: "issues.critical = 1" },
  { cls: "code-key", text: 'ask("Explain the auth flow")' },
  { cls: "", text: "" },
];

const FLOW = [
  {
    step: "01",
    title: "Connect a repository",
    text: "Link a GitHub repository or upload a ZIP. RepoLens filters unnecessary files and focuses on the source that matters.",
  },
  {
    step: "02",
    title: "Build code knowledge",
    text: "Your codebase is parsed, chunked, embedded, and indexed so relevant context can be retrieved when you ask questions.",
  },
  {
    step: "03",
    title: "Ask, review, improve",
    text: "Chat with grounded answers, explore a code health report, and work through prioritized issues in your repository.",
  },
];

const OUTCOMES = [
  {
    title: "Health report",
    text: "Review architecture, security, performance, code quality, and testing through a clear repository health report.",
  },
  {
    title: "Grounded chat",
    text: "Ask questions about your codebase and receive answers grounded in relevant files and code locations.",
  },
  {
    title: "Issues & roadmap",
    text: "Find important problems, filter them by severity and category, and focus on improvements that matter.",
  },
];

const NAV_LINKS = [
  { href: "#why", label: "Why" },
  { href: "#how", label: "How it works" },
  { href: "#features", label: "Features" },
  { href: "#demo", label: "Demo" },
];

function CodePlane() {
  const lines = [...CODE_LINES, ...CODE_LINES, ...CODE_LINES];

  return (
    <div
      className="landing-code-plane landing-reveal landing-reveal-delay-2"
      aria-hidden
    >
      <div className="landing-code-fade" />

      <pre>
        {lines.map((line, index) => (
          <span
            key={`${line.text}-${index}`}
            className={line.cls || undefined}
          >
            {line.text}
            {"\n"}
          </span>
        ))}
      </pre>
    </div>
  );
}

export default function HomePage() {
  return (
    <div className="landing-shell">
      {/* Hero */}
      <section id="top" className="landing-hero">
        <div className="landing-hero-glow" aria-hidden />

        <div className="relative z-40 mx-auto w-full max-w-6xl px-6 pt-6 sm:px-10">
          <header className="landing-header landing-reveal flex items-center justify-between gap-3 rounded-2xl px-4 py-3 sm:gap-4 sm:px-5">
            <a
              href="#top"
              className="landing-brand shrink-0 text-sm text-(--landing-ink)"
            >
              RepoLens
            </a>

            <nav
              aria-label="Landing sections"
              className="hidden items-center gap-1 md:flex lg:gap-2"
            >
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="landing-nav-link"
                >
                  {link.label}
                </a>
              ))}
            </nav>

            <div className="flex shrink-0 items-center gap-2 text-sm sm:gap-3">
              <ThemeToggle className="border-(--landing-line) bg-transparent hover:bg-(--landing-fog)" />

              <Link
                href="/login"
                className="text-(--landing-muted) transition-colors hover:text-(--landing-ink)"
              >
                Sign in
              </Link>

              <Link
                href="/register"
                className="rounded-xl bg-(--landing-ink) px-3.5 py-2 font-medium text-(--landing-paper) transition-opacity hover:opacity-90"
              >
                Get started
              </Link>
            </div>
          </header>
        </div>

        <div className="relative z-10 mx-auto grid min-h-[calc(100svh-5.5rem)] w-full max-w-6xl items-center gap-10 px-6 pb-16 pt-10 sm:px-10 md:grid-cols-[1.05fr_0.95fr] md:gap-12 lg:gap-14">
          <div className="py-6 sm:py-10">
            <h1 className="landing-reveal landing-reveal-delay-1 landing-title text-5xl text-(--landing-ink) sm:text-6xl lg:text-[4.75rem]">
              Understand
              <span className="block">Your Codebase.</span>
            </h1>

            <p className="landing-reveal landing-reveal-delay-2 mt-6 text-2xl font-semibold tracking-tight text-(--landing-ink) sm:text-3xl">
              Your AI senior developer for every repository.
            </p>

            <p className="landing-reveal landing-reveal-delay-3 mt-5 max-w-md text-base leading-relaxed text-(--landing-muted) sm:text-lg">
              Connect a project, get a code health report, and ask precise
              questions grounded in your real code.
            </p>

            <div className="landing-reveal landing-reveal-delay-4 mt-10 flex flex-wrap items-center gap-3">
              <Link
                href="/login"
                className="landing-btn-primary rounded-xl px-5 py-3.5 text-sm font-semibold"
              >
                Analyze My Repository
              </Link>

              <a
                href="#demo"
                className="landing-btn-secondary rounded-xl px-5 py-3.5 text-sm font-semibold"
              >
                View Demo
              </a>
            </div>
          </div>

          <div className="hidden md:block">
            <CodePlane />
          </div>
        </div>
      </section>

      {/* Why RepoLens */}
      <section
        id="why"
        className="landing-band scroll-mt-28 px-6 py-24 sm:px-10"
      >
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
          <div>
            <p className="landing-kicker">Why RepoLens</p>

            <h2 className="landing-title mt-5 text-3xl sm:text-5xl">
              Stop guessing through unfamiliar code.
            </h2>
          </div>

          <p className="max-w-md text-base leading-relaxed text-(--landing-muted) sm:text-lg">
            Traditional tools can identify patterns, but understanding a
            repository often requires connecting those patterns across files.
            RepoLens builds searchable knowledge of your codebase and uses that
            context to help you understand how the system actually works.
          </p>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="scroll-mt-28 px-6 py-24 sm:px-10">
        <div className="mx-auto max-w-6xl">
          <h2 className="landing-title text-3xl sm:text-5xl">
            From repository to insight
          </h2>

          <p className="mt-5 max-w-xl text-base text-(--landing-muted) sm:text-lg">
            One clear path from source code to useful engineering context.
          </p>

          <ol className="mt-14 space-y-0 border-t border-(--landing-line)">
            {FLOW.map((item) => (
              <li
                key={item.step}
                className="grid gap-4 border-b border-(--landing-line) py-10 sm:grid-cols-[96px_1fr]"
              >
                <span className="font-mono text-sm font-medium text-(--landing-accent)">
                  {item.step}
                </span>

                <div>
                  <h3 className="landing-title text-2xl">
                    {item.title}
                  </h3>

                  <p className="mt-3 max-w-2xl text-base leading-relaxed text-(--landing-muted)">
                    {item.text}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Features */}
      <section
        id="features"
        className="landing-band scroll-mt-28 px-6 py-24 sm:px-10"
      >
        <div className="mx-auto max-w-6xl">
          <h2 className="landing-title text-3xl sm:text-5xl">
            Built for real code review
          </h2>

          <p className="mt-5 max-w-xl text-base text-(--landing-muted) sm:text-lg">
            Explore your repository, understand unfamiliar code, and identify
            areas that need attention.
          </p>

          <div className="mt-14 grid gap-x-10 gap-y-12 border-t border-(--landing-line) pt-12 md:grid-cols-3">
            {OUTCOMES.map((item) => (
              <div key={item.title}>
                <h3 className="landing-title text-xl">
                  {item.title}
                </h3>

                <p className="mt-3 text-sm leading-relaxed text-(--landing-muted) sm:text-base">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Demo */}
      <section id="demo" className="scroll-mt-28 px-6 py-24 sm:px-10">
        <div className="mx-auto max-w-6xl">
          <h2 className="landing-title text-3xl sm:text-5xl">
            See your codebase differently
          </h2>

          <p className="mt-5 max-w-xl text-base text-(--landing-muted) sm:text-lg">
            Repository analysis, health insights, and grounded code
            explanations in one workflow.
          </p>

          <div className="landing-demo mt-12 overflow-hidden rounded-3xl p-6 text-white sm:p-10">
            <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
              <div>
                <p className="font-mono text-xs tracking-[0.18em] text-(--landing-glow) uppercase">
                  project / payment-api
                </p>

                <p className="landing-score landing-title mt-5 text-6xl sm:text-7xl">
                  82
                  <span className="text-2xl text-white/45">
                    {" "}
                    / 100
                  </span>
                </p>

                <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/70">
                  Repository health score covering architecture, security,
                  performance, quality, and testing.
                </p>
              </div>

              <div className="space-y-3 font-mono text-xs sm:text-sm">
                <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4">
                  <p className="text-(--landing-glow)">You</p>

                  <p className="mt-2 text-white/90">
                    Explain the authentication flow.
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-black/25 px-4 py-4">
                  <p className="text-(--landing-glow)">RepoLens AI</p>

                  <p className="mt-2 leading-relaxed text-white/85">
                    Authentication starts in{" "}
                    <span className="text-(--landing-glow)">
                      src/lib/auth.ts
                    </span>
                    . Sessions are issued after credential checks, while
                    protected routes are handled through the application
                    middleware.
                  </p>

                  <p className="mt-3 text-white/40">
                    Sources: src/lib/auth.ts · src/proxy.ts
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="landing-cta px-6 py-24 sm:px-10">
        <div className="mx-auto flex max-w-6xl flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <h2 className="landing-title text-3xl text-white sm:text-5xl">
              Understand your repository before you change it.
            </h2>

            <p className="mt-5 text-base leading-relaxed text-white/65 sm:text-lg">
              Connect your codebase, explore its structure, understand complex
              flows, and use AI-powered analysis to make better engineering
              decisions.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/register"
              className="landing-btn-primary rounded-xl px-5 py-3.5 text-sm font-semibold"
            >
              Create Account
            </Link>

            <Link
              href="/login"
              className="rounded-xl border border-white/20 px-5 py-3.5 text-sm font-semibold text-white transition-colors hover:border-white"
            >
              Analyze My Repository
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-(--landing-line) px-6 py-8 text-sm text-(--landing-muted) sm:px-10">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3">
          <p className="landing-brand text-(--landing-ink)">
            RepoLens
          </p>

          <p>Next.js · RAG · Groq · pgvector</p>
        </div>
      </footer>
    </div>
  );
}
