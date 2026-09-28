import { getUsageSnapshot } from "@/lib/usage/usage";
import { cn } from "@/lib/utils";
import Link from "next/link";

function formatLimit(n: number) {
  return Number.isFinite(n) ? String(n) : "∞";
}

export async function NavUsage({ userId }: { userId: string }) {
  const usage = await getUsageSnapshot(userId);

  const used = usage.analysesUsedToday;
  const max = usage.limits.analysesPerDay;
  const nearLimit = Number.isFinite(max) && used / max >= 0.8;

  return (
    <Link
      href="/settings"
      title="View usage"
      className={cn(
        "hidden items-center gap-2 rounded-full border px-2.5 py-1 text-xs transition-colors sm:inline-flex",
        "border-[color:var(--app-line)] bg-[color:var(--app-surface)] text-[color:var(--app-ink)] hover:border-[color:var(--app-accent)]/40",
      )}
    >
      <span className="rounded-full bg-muted px-1.5 py-0.5 text-[10px] font-semibold tracking-wide uppercase text-[color:var(--app-muted)]">
        Usage
      </span>

      <span
        className={cn(
          "font-medium tabular-nums",
          nearLimit
            ? "text-amber-700 dark:text-amber-300"
            : "text-[color:var(--app-muted)]",
        )}
      >
        {used}/{formatLimit(max)}
        <span className="ms-1 hidden font-normal lg:inline">today</span>
      </span>
    </Link>
  );
}