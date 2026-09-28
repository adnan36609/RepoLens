export type PlanId = "free";

export type PlanLimits = {
  analysesPerDay: number;
  chatPerHour: number;
  maxProjects: number;
  label: string;
  features: string[];
};

function envInt(name: string, fallback: number): number {
  const raw = process.env[name];
  if (!raw) return fallback;

  const n = Number(raw);
  return Number.isFinite(n) && n > 0 ? n : fallback;
}

export const PLANS: Record<PlanId, PlanLimits> = {
  free: {
    label: "Free",
    analysesPerDay: envInt("PLAN_FREE_ANALYSES_PER_DAY", 5),
    chatPerHour: envInt("PLAN_FREE_CHAT_PER_HOUR", 20),
    maxProjects: envInt("PLAN_FREE_MAX_PROJECTS", 5),
    features: [
      `${envInt("PLAN_FREE_ANALYSES_PER_DAY", 5)} analyses / day`,
      `${envInt("PLAN_FREE_MAX_PROJECTS", 5)} projects`,
      `${envInt("PLAN_FREE_CHAT_PER_HOUR", 20)} chat messages / hour`,
    ],
  },
};

export function getPlanLimits(): PlanLimits {
  return PLANS.free;
}