import {
  GenerateReportButton,
  RetryFullAnalysisButton,
} from "@/components/projects/report-actions";
import { RetryKnowledgeButton } from "@/components/projects/retry-knowledge";
import { buttonVariants } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { notFound } from "next/navigation";

type PageProps = {
  params: Promise<{ id: string }>;
};

function statusClass(status: string) {
  if (status === "completed") return "app-status-completed";
  if (status === "failed") return "app-status-failed";
  return "app-status-processing";
}

export default async function ProjectOverviewPage({ params }: PageProps) {
  const session = await auth();
  if (!session?.user) return null;

  const { id } = await params;
  const project = await prisma.project.findFirst({
    where: { id, userId: session.user.id },
    include: {
      report: {
        select: { healthScore: true },
      },
      _count: { select: { chunks: true } },
    },
  });

  if (!project) notFound();

  const chatReady = project._count.chunks > 0;
  const reportReady = Boolean(project.report);

  const navLinks = [
    reportReady
      ? {
          href: `/projects/${project.id}/report`,
          label: "Health Report",
          primary: true,
        }
      : null,
    reportReady
      ? { href: `/projects/${project.id}/issues`, label: "Issues" }
      : null,
    chatReady
      ? { href: `/projects/${project.id}/chat`, label: "AI Chat" }
      : null,
    { href: `/projects/${project.id}/explorer`, label: "Explorer" },
  ].filter(Boolean) as Array<{
    href: string;
    label: string;
    primary?: boolean;
  }>;

  return (
    <main className="app-page repolens-project-page">
      <header className="repolens-project-header">
        <div className="repolens-project-heading">
          <div>
            <p className="repolens-workspace-kicker">PROJECT / OVERVIEW</p>

            <h1 className="repolens-project-title">{project.name}</h1>

            <div className="repolens-project-status-row">
              <span
                className={cn(
                  "app-status",
                  statusClass(project.status),
                )}
              >
                {project.status}
              </span>

              {project.status === "processing" ||
              project.status === "queued" ? (
                <Link
                  href={`/projects/${project.id}/progress`}
                  className="repolens-project-progress-link"
                >
                  View progress →
                </Link>
              ) : null}
            </div>
          </div>

          <nav className="repolens-project-nav">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "repolens-project-nav-link",
                  link.primary && "repolens-project-nav-primary",
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      <section className="repolens-project-overview">
        <div className="repolens-project-section-heading">
          <h2>CODEBASE</h2>
          <span>SYSTEM INFORMATION</span>
        </div>

        <div className="repolens-project-grid">
          <div className="repolens-project-stat">
            <span>SOURCE</span>
            <strong>{project.source}</strong>
          </div>

          <div className="repolens-project-stat">
            <span>FRAMEWORK</span>
            <strong>{project.framework ?? "Unknown"}</strong>
          </div>

          <div className="repolens-project-stat">
            <span>SOURCE FILES</span>
            <strong>{project.fileCount}</strong>
          </div>

          <div className="repolens-project-stat">
            <span>CODE CHUNKS</span>
            <strong>{project._count.chunks}</strong>
          </div>

          <div className="repolens-project-stat">
            <span>HEALTH SCORE</span>
            <strong className="repolens-project-score">
              {project.report ? `${project.report.healthScore}/100` : "—"}
            </strong>
          </div>

          {project.repositoryUrl ? (
            <div className="repolens-project-stat repolens-project-repository">
              <span>REPOSITORY</span>
              <a
                href={project.repositoryUrl}
                target="_blank"
                rel="noreferrer"
              >
                {project.repositoryUrl}
              </a>
            </div>
          ) : null}
        </div>

        {project.errorMessage ? (
          <div className="repolens-project-error">
            {project.errorMessage}
          </div>
        ) : null}

        {reportReady ? (
          <div className="repolens-project-action">
            <div>
              <span className="repolens-workspace-kicker">
                ANALYSIS COMPLETE
              </span>
              <p>
                Health report is ready. Open it for category scores,
                issues, and the improvement roadmap.
              </p>
            </div>

            <RetryFullAnalysisButton projectId={project.id} />
          </div>
        ) : chatReady ? (
          <div className="repolens-project-action">
            <div>
              <span className="repolens-workspace-kicker">
                KNOWLEDGE READY
              </span>
              <p>
                Code knowledge is ready. Generate the health report next.
              </p>
            </div>

            <div className="repolens-project-actions">
              <GenerateReportButton projectId={project.id} />
              <RetryFullAnalysisButton projectId={project.id} />
            </div>
          </div>
        ) : null}

        {project.status === "failed" ? (
          <div className="repolens-project-action repolens-project-failed">
            <div>
              <span className="repolens-workspace-kicker">
                ANALYSIS FAILED
              </span>
              <p>
                The analysis did not complete. You can retry the pipeline
                or start with another repository.
              </p>
            </div>

            <div className="repolens-project-actions">
              <RetryFullAnalysisButton projectId={project.id} />
              <RetryKnowledgeButton projectId={project.id} />

              <Link
                href="/projects/new"
                className="repolens-project-nav-link"
              >
                Try another project
              </Link>
            </div>
          </div>
        ) : null}
      </section>
    </main>
  );
}