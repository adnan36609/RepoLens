import React from "react";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { ThemeToggle } from "@/components/theme-toggle";
import { auth } from "@/lib/auth";
import Link from "next/link";

const SYSTEMS = [
  {
    label: "Repository Sync",
    steps: [
      "GitHub / ZIP",
      "Source extraction",
      "Framework detection",
      "Ready for analysis",
    ],
    lines: [
      "> connecting repository...",
      "> extracting source files...",
      "> detecting framework...",
      "> repository ready ✓",
    ],
  },
  {
    label: "Code Intelligence",
    steps: [
      "Source files",
      "Tree-sitter chunks",
      "384-d embeddings",
      "pgvector",
    ],
    lines: [
      "> reading source...",
      "> parsing code structure...",
      "> generating embeddings...",
      "> vector index ready ✓",
    ],
  },
  {
    label: "AI Query",
    steps: [
      "User question",
      "Relevant code",
      "Groq generation",
      "Grounded answer",
    ],
    lines: [
      "> receiving question...",
      "> retrieving relevant context...",
      "> generating response...",
      "> grounded answer ready ✓",
    ],
  },
];

function SystemCard({
  system,
  index,
}: {
  system: (typeof SYSTEMS)[number];
  index: number;
}) {
  return (
    <article
      className="repolens-system-card"
      style={{ "--system-delay": `${index * 180}ms` } as React.CSSProperties}
    >
      <div className="repolens-card-scan" />

      <div className="repolens-card-header">
        <h3>{system.label}</h3>

        <span className="repolens-live">
          <i />
          LIVE
        </span>
      </div>

      <div className="repolens-pipeline">
        {system.steps.map((step, stepIndex) => (
          <React.Fragment key={step}>
            <div className="repolens-pipeline-step">
              <span>{String(stepIndex + 1).padStart(2, "0")}</span>
              <strong>{step}</strong>
            </div>

            {stepIndex < system.steps.length - 1 && (
              <div className="repolens-pipeline-arrow">↓</div>
            )}
          </React.Fragment>
        ))}
      </div>

      <div className="repolens-system-log">
        {system.lines.map((line, lineIndex) => (
          <p
            key={line}
            className={`repolens-log-line repolens-log-${lineIndex}`}
          >
            {line}
          </p>
        ))}
      </div>
    </article>
  );
}

export default async function HomePage() {
  const session = await auth();
  const signedIn = !!session?.user?.id;

  return (
    <div className="repolens-home">
      <div className="repolens-background" aria-hidden />

      {/* Navigation */}
      <header className="repolens-nav-wrap">
        <nav className="repolens-nav">
          <a href="#top" className="repolens-logo">
            <span>R</span>
            RepoLens
          </a>

          <div className="repolens-nav-links">
            <a href="#systems">Systems</a>
            <a href="#about">About</a>
            <a
              href="https://github.com/adnan36609/RepoLens"
              target="_blank"
              rel="noreferrer"
            >
              GitHub
            </a>
          </div>

          <div className="repolens-nav-actions">
            <ThemeToggle className="repolens-theme-toggle" />

            {signedIn ? (
              <>
                <SignOutButton />

                <Link href="/dashboard" className="repolens-nav-button">
                  Dashboard
                </Link>
              </>
            ) : (
              <>
                <Link href="/login" className="repolens-sign-in">
                  Sign in
                </Link>

                <Link href="/register" className="repolens-nav-button">
                  Get started
                </Link>
              </>
            )}
          </div>
        </nav>
      </header>

      <main id="top">
        {/* Status */}
        <section className="repolens-status">
          <div>
            <span className="repolens-status-dot" />
            SYSTEM OPERATIONAL
          </div>

          <span>v0.1.0-stable</span>
        </section>

        {/* Hero */}
        <section className="repolens-hero">
          <div className="repolens-hero-copy">
            <p className="repolens-eyebrow">AI CODEBASE INTELLIGENCE</p>

            <h1>
              Understand the
              <span>architecture</span>
              behind your code.
            </h1>

            <p className="repolens-description">
              Analyze repositories, build searchable code knowledge, and ask
              questions grounded in your actual source code.
            </p>

            <div className="repolens-hero-actions">
              <Link
                href={signedIn ? "/dashboard" : "/login"}
                className="repolens-primary-button"
              >
                Analyze Repository
                <span>→</span>
              </Link>

              <span className="repolens-free-note">
                Free to use · No credit card
              </span>
            </div>
          </div>

          <div className="repolens-hero-meta">
            <div>
              <span>ENGINE</span>
              <strong>RAG + VECTOR</strong>
            </div>

            <div>
              <span>INDEX</span>
              <strong>LIVE</strong>
            </div>

            <div>
              <span>QUERY</span>
              <strong>GROUNDED</strong>
            </div>
          </div>
        </section>

        {/* Live systems */}
        <section id="systems" className="repolens-systems">
  <div className="repolens-section-heading">
    <h2>System Activity</h2>
    <span>LIVE MONITOR</span>
  </div>

  <div className="repolens-system-grid">
    {SYSTEMS.map((system, index) => (
      <SystemCard
        key={system.label}
        system={system}
        index={index}
      />
    ))}
  </div>
</section>

        {/* Compact info strip */}
        {/* <section id="about" className="repolens-info">
          <div>
            <span>01</span>
            <strong>INDEX</strong>
            <p>Repository source → searchable knowledge</p>
          </div>

          <div>
            <span>02</span>
            <strong>UNDERSTAND</strong>
            <p>Architecture, issues, dependencies, and flows</p>
          </div>

          <div>
            <span>03</span>
            <strong>QUERY</strong>
            <p>AI answers grounded in your code</p>
          </div>
        </section> */}
      </main>

      {/* Footer */}
      <footer className="repolens-footer">
        <div>
          <a href="#top" className="repolens-logo">
            <span>R</span>
            RepoLens
          </a>

          <p>AI-powered codebase intelligence.</p>
        </div>

        <div className="repolens-stack">
          <span>Next.js</span>
          <span>TypeScript</span>
          <span>PostgreSQL</span>
          <span>pgvector</span>
          <span>Groq</span>
        </div>

        <div className="repolens-footer-right">
          <span>ALL SYSTEMS OPERATIONAL</span>
          <span>© 2026 RepoLens</span>
        </div>
      </footer>
    </div>
  );
}