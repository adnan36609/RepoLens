import { prisma } from "@/lib/db";
import { getPlanLimits } from "@/lib/usage/limits";

export class UsageLimitError extends Error {
  code: "analyses" | "projects" | "chat";

  constructor(code: UsageLimitError["code"], message: string) {
    super(message);
    this.name = "UsageLimitError";
    this.code = code;
  }
}

function startOfUtcDay(): Date {
  const d = new Date();
  d.setUTCHours(0, 0, 0, 0);
  return d;
}

function startOfUtcHour(): Date {
  const d = new Date();
  d.setUTCMinutes(0, 0, 0);
  return d;
}

export async function recordAnalysisUsage(userId: string): Promise<void> {
  await prisma.usageEvent.create({
    data: {
      userId,
      type: "analysis",
    },
  });
}

export async function recordChatUsage(userId: string): Promise<void> {
  await prisma.usageEvent.create({
    data: {
      userId,
      type: "chat",
    },
  });
}

export async function assertCanCreateProject(userId: string): Promise<void> {
  const limits = getPlanLimits();

  const projectCount = await prisma.project.count({
    where: { userId },
  });

  if (projectCount >= limits.maxProjects) {
    throw new UsageLimitError(
      "projects",
      `Project limit reached (${limits.maxProjects} projects).`,
    );
  }
}

export async function assertCanRunAnalysis(userId: string): Promise<void> {
  const limits = getPlanLimits();
  const since = startOfUtcDay();

  const used = await prisma.usageEvent.count({
    where: {
      userId,
      type: "analysis",
      createdAt: { gte: since },
    },
  });

  if (used >= limits.analysesPerDay) {
    throw new UsageLimitError(
      "analyses",
      `Daily analysis limit reached (${limits.analysesPerDay}/day). Try again tomorrow.`,
    );
  }
}

export async function assertCanSendChat(userId: string): Promise<void> {
  const limits = getPlanLimits();
  const since = startOfUtcHour();

  const used = await prisma.usageEvent.count({
    where: {
      userId,
      type: "chat",
      createdAt: { gte: since },
    },
  });

  if (used >= limits.chatPerHour) {
    throw new UsageLimitError(
      "chat",
      `Chat limit reached (${limits.chatPerHour}/hour). Try again later.`,
    );
  }
}

export async function getUsageSnapshot(userId: string) {
  const limits = getPlanLimits();

  const dayStart = startOfUtcDay();
  const hourStart = startOfUtcHour();

  const [analysesUsedToday, chatUsedThisHour, projectCount] =
    await Promise.all([
      prisma.usageEvent.count({
        where: {
          userId,
          type: "analysis",
          createdAt: { gte: dayStart },
        },
      }),
      prisma.usageEvent.count({
        where: {
          userId,
          type: "chat",
          createdAt: { gte: hourStart },
        },
      }),
      prisma.project.count({
        where: { userId },
      }),
    ]);

  return {
    limits,
    analysesUsedToday,
    chatUsedThisHour,
    projectCount,
  };
}