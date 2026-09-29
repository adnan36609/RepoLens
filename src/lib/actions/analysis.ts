"use server";

import { buildProjectKnowledge } from "@/lib/analysis/pipeline";
import { setProjectProgress } from "@/lib/analysis/progress";
import { generateProjectReport } from "@/lib/analysis/report";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { extractFromZipBuffer } from "@/lib/files/extract";
import { isSourceFile } from "@/lib/files/filters";
import { detectFramework } from "@/lib/files/framework";
import { deleteProjectFiles, persistProjectFiles } from "@/lib/files/storage";
import { downloadGitHubZipball } from "@/lib/github";
import { MAX_REPO_SIZE_BYTES } from "@/lib/limits";
import { revalidatePath } from "next/cache";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { redirect } from "next/navigation";
import { refreshProjectSources } from "@/lib/analysis/project-sources";
import {
  assertCanRunAnalysis,
  recordAnalysisUsage,
  UsageLimitError,
} from "@/lib/usage/usage";

export type RetryState = {
  error?: string;
};

async function requireOwnedProject(projectId: string) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const project = await prisma.project.findFirst({
    where: { id: projectId, userId: session.user.id },
  });

  if (!project) return null;
  return project;
}

export async function retryProjectKnowledge(
  _prev: RetryState,
  formData: FormData,
): Promise<RetryState> {
  const projectId = String(formData.get("projectId") ?? "");
  if (!projectId) return { error: "Missing project id." };

  const project = await requireOwnedProject(projectId);
  if (!project) return { error: "Project not found." };

  try {
    await buildProjectKnowledge(project.id);
    revalidatePath(`/projects/${project.id}`);
    revalidatePath("/dashboard");
    redirect(`/projects/${project.id}`);
  } catch (error) {
    if (isRedirectError(error)) throw error;
    return {
      error:
        error instanceof Error
          ? error.message
          : "Failed to rebuild code knowledge.",
    };
  }
}

export async function retryFullAnalysis(
  _prev: RetryState,
  formData: FormData,
): Promise<RetryState> {
  const projectId = String(formData.get("projectId") ?? "");
  if (!projectId) return { error: "Missing project id." };

  const project = await requireOwnedProject(projectId);
  if (!project) return { error: "Project not found." };

  if (project.status === "processing" || project.status === "queued") {
    return { error: "Analysis is already running for this project." };
  }

  try {
    // Pull fresh GitHub code when possible; ZIP projects reuse local files.
    await refreshProjectSources(project);

    await prisma.project.update({
      where: { id: project.id },
      data: {
        status: "queued",
        progressStep:
          project.source === "github"
            ? "Latest code fetched — waiting to analyze"
            : "Waiting to restart analysis",
        progressPercent: Math.max(project.progressPercent || 0, 25),
        errorMessage: null,
      },
    });
    revalidatePath(`/projects/${project.id}`);
    revalidatePath(`/projects/${project.id}/progress`);
    revalidatePath("/dashboard");
    redirect(`/projects/${project.id}/progress`);
  } catch (error) {
    if (isRedirectError(error)) throw error;

    await setProjectProgress(project.id, {
      step: "Re-analyze failed",
      percent: project.progressPercent || 0,
      status: "failed",
      errorMessage:
        error instanceof Error
          ? error.message
          : "Failed to restart project analysis.",
    });
    return {
      error:
        error instanceof Error
          ? error.message
          : "Failed to restart project analysis.",
    };
  }
}

export async function generateReportAction(
  _prev: RetryState,
  formData: FormData,
): Promise<RetryState> {
  const projectId = String(formData.get("projectId") ?? "");
  if (!projectId) return { error: "Missing project id." };

  const project = await requireOwnedProject(projectId);
  if (!project) return { error: "Project not found." };

  try {
    await assertCanRunAnalysis(project.userId);
    await recordAnalysisUsage(project.userId);

    await generateProjectReport(project.id);

    revalidatePath(`/projects/${project.id}`);
    revalidatePath(`/projects/${project.id}/report`);
    revalidatePath("/dashboard");

    redirect(`/projects/${project.id}/report`);
  } catch (error) {
    if (isRedirectError(error)) throw error;

    if (error instanceof UsageLimitError) {
      return { error: error.message };
    }

    return {
      error:
        error instanceof Error
          ? error.message
          : "Failed to generate health report.",
    };
  }
}