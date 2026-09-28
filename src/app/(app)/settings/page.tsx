import { Button, buttonVariants } from "@/components/ui/button";
import {
  connectGitHubAccount,
  disconnectGitHub,
} from "@/lib/actions/github";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getUsageSnapshot } from "@/lib/usage/usage";
import { cn } from "@/lib/utils";
import Link from "next/link";

type PageProps = {
  searchParams: Promise<{
    github?: string;
    github_error?: string;
  }>;
};

export default async function SettingsPage({ searchParams }: PageProps) {
  const session = await auth();
  if (!session?.user) return null;

  const params = await searchParams;

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      name: true,
      email: true,
      authProvider: true,
      githubUsername: true,
      githubAccessToken: true,
    },
  });

  const usage = await getUsageSnapshot(session.user.id);
  const githubConnected = Boolean(user?.githubAccessToken);

  return (
    <main className="app-page app-page-narrow">
      <header className="mb-8">
        <p className="app-kicker">Account</p>
        <h1 className="app-title mt-2 text-3xl">Settings</h1>
        <p className="mt-2 text-sm text-[color:var(--app-muted)]">
          Manage your profile, usage, and GitHub connection.
        </p>
      </header>

      {params.github === "connected" ? (
        <p className="mb-4 rounded-2xl border border-[color:var(--app-line)] bg-[color:var(--app-accent)]/10 px-4 py-3 text-sm text-[color:var(--app-accent-deep)]">
          GitHub connected successfully.
        </p>
      ) : null}

      {params.github_error ? (
        <p className="mb-4 rounded-2xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          GitHub connection failed ({params.github_error}). Try again.
        </p>
      ) : null}

      <section className="app-panel mb-5 space-y-4 p-6">
        <div>
          <h2 className="app-title text-lg">Usage</h2>
          <p className="mt-1 text-sm text-[color:var(--app-muted)]">
            Your current RepoLens usage limits.
          </p>
        </div>

        <dl className="grid gap-2 text-sm sm:grid-cols-2">
          <div className="rounded-xl border border-[color:var(--app-line)] px-3 py-2.5">
            <dt className="text-xs text-[color:var(--app-muted)]">
              Analyses today
            </dt>
            <dd className="mt-1 font-semibold tabular-nums">
              {usage.analysesUsedToday}
              <span className="font-normal text-[color:var(--app-muted)]">
                {" "}/ {usage.limits.analysesPerDay}
              </span>
            </dd>
          </div>

          <div className="rounded-xl border border-[color:var(--app-line)] px-3 py-2.5">
            <dt className="text-xs text-[color:var(--app-muted)]">
              AI interactions this hour
            </dt>
            <dd className="mt-1 font-semibold tabular-nums">
              {usage.chatUsedThisHour}
              <span className="font-normal text-[color:var(--app-muted)]">
                {" "}/ {usage.limits.chatPerHour}
              </span>
            </dd>
          </div>

          <div className="rounded-xl border border-[color:var(--app-line)] px-3 py-2.5 sm:col-span-2">
            <dt className="text-xs text-[color:var(--app-muted)]">
              Projects
            </dt>
            <dd className="mt-1 font-semibold tabular-nums">
              {usage.projectCount}
              <span className="font-normal text-[color:var(--app-muted)]">
                {" "}/ {usage.limits.maxProjects}
              </span>
            </dd>
          </div>
        </dl>
      </section>

      <section className="app-panel mb-5 space-y-3 p-6">
        <h2 className="app-title text-lg">Profile</h2>

        <dl className="space-y-2 text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-[color:var(--app-muted)]">Name</dt>
            <dd className="font-medium">{user?.name ?? "—"}</dd>
          </div>

          <div className="flex justify-between gap-4">
            <dt className="text-[color:var(--app-muted)]">Email</dt>
            <dd className="font-medium">{user?.email ?? "—"}</dd>
          </div>

          <div className="flex justify-between gap-4">
            <dt className="text-[color:var(--app-muted)]">
              Auth provider
            </dt>
            <dd className="font-medium capitalize">
              {user?.authProvider ?? "—"}
            </dd>
          </div>
        </dl>
      </section>

      <section className="app-panel space-y-4 p-6">
        <div>
          <h2 className="app-title text-lg">GitHub</h2>
          <p className="mt-1 text-sm text-[color:var(--app-muted)]">
            Required to select a repository. If you signed in with GitHub,
            the connection already appears here.
          </p>
        </div>

        {githubConnected ? (
          <>
            <p className="text-sm">
              Connected as{" "}
              <span className="font-semibold text-[color:var(--app-accent-deep)]">
                {user?.githubUsername ?? "GitHub"}
              </span>
            </p>

            <form action={disconnectGitHub}>
              <Button type="submit" variant="outline">
                Disconnect GitHub
              </Button>
            </form>
          </>
        ) : (
          <>
            <p className="text-sm text-[color:var(--app-muted)]">
              GitHub is not connected yet.
            </p>

            <form action={connectGitHubAccount}>
              <Button
                type="submit"
                className="bg-[linear-gradient(135deg,#06b6d4_0%,#0e7490_100%)] text-white hover:opacity-90"
              >
                Connect GitHub
              </Button>
            </form>
          </>
        )}

        <Link
          href="/dashboard"
          className={cn(
            buttonVariants({ variant: "ghost", size: "sm" }),
            "px-0",
          )}
        >
          ← Back to projects
        </Link>
      </section>
    </main>
  );
}