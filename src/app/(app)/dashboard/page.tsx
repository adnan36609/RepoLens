import { buttonVariants } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getUsageSnapshot } from "@/lib/usage/usage";

function statusClass(status: string) {
  if (status === "completed") return "app-status-completed";
  if (status === "failed") return "app-status-failed";
  return "app-status-processing";
}

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) redirect("/login");

  const [projects, usage] = await Promise.all([
    prisma.project.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      include: {
        report: {
          select: { healthScore: true },
        },
        _count: {
          select: { chunks: true },
        },
      },
    }),
    getUsageSnapshot(session.user.id),
  ]);

  return (
    <main className="app-page repolens-workspace">
      <header className="repolens-workspace-header">
        <div>
          <p className="repolens-workspace-kicker">WORKSPACE</p>

          <h1 className="repolens-workspace-title">
            Hello, {session.user.name?.split(" ")[0] ?? "there"}
          </h1>

          <p className="repolens-workspace-description">
            Your analyzed repositories and codebase intelligence live here.
          </p>
        </div>

        <Link
          href="/projects/new"
          className={cn(
            buttonVariants({ size: "default" }),
            "repolens-primary-button",
          )}
        >
          + Analyze repository
        </Link>
      </header>

      <section className="repolens-usage-grid">
        <div className="repolens-usage-card">
          <span>ANALYSES / DAY</span>
          <strong>{usage.analysesUsedToday}</strong>
          <small>/ {usage.limits.analysesPerDay}</small>
        </div>

        <div className="repolens-usage-card">
          <span>AI QUERIES / HOUR</span>
          <strong>{usage.chatUsedThisHour}</strong>
          <small>/ {usage.limits.chatPerHour}</small>
        </div>

        <div className="repolens-usage-card">
          <span>PROJECTS</span>
          <strong>{usage.projectCount}</strong>
          <small>/ {usage.limits.maxProjects}</small>
        </div>
      </section>

      {projects.length === 0 ? (
        <section className="repolens-empty-state">
          <span className="repolens-workspace-kicker">NO REPOSITORIES</span>

          <h2>Analyze your first codebase</h2>

          <p>
            Connect a GitHub repository or upload a ZIP to build searchable
            code knowledge.
          </p>

          <Link
            href="/projects/new"
            className={cn(
              buttonVariants({ size: "default" }),
              "repolens-primary-button",
            )}
          >
            Analyze repository →
          </Link>
        </section>
      ) : (
        <section className="repolens-projects-section">
          <div className="repolens-projects-heading">
            <h2>PROJECTS</h2>
            <span>{projects.length} REPOSITORIES</span>
          </div>

          <div className="repolens-project-list">
            {projects.map((project) => {
              const inFlight =
                project.status === "processing" ||
                project.status === "queued";

              const href = inFlight
                ? `/projects/${project.id}/progress`
                : `/projects/${project.id}`;

              return (
                <Link
                  key={project.id}
                  href={href}
                  className="repolens-project-row"
                >
                  <div className="repolens-project-main">
                    <h3>{project.name}</h3>

                    <p>
                      {project.framework ?? "Unknown framework"} ·{" "}
                      {project.fileCount} source files
                      {project._count.chunks
                        ? ` · ${project._count.chunks} chunks`
                        : ""}
                      {project.source === "github" ? " · GitHub" : " · ZIP"}
                    </p>
                  </div>

                  <div className="repolens-project-meta">
                    {project.report ? (
                      <span className="repolens-health">
                        HEALTH{" "}
                        <strong>{project.report.healthScore}</strong>
                      </span>
                    ) : null}

                    <span
                      className={cn(
                        "app-status",
                        statusClass(project.status),
                      )}
                    >
                      {project.status}
                    </span>

                    <span className="repolens-project-arrow">→</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}
    </main>
  );
}