import { setProjectProgress } from "@/lib/analysis/progress";
import { prisma } from "@/lib/db";
import { extractFromZipBuffer } from "@/lib/files/extract";
import { isSourceFile } from "@/lib/files/filters";
import { detectFramework } from "@/lib/files/framework";
import { deleteProjectFiles, persistProjectFiles } from "@/lib/files/storage";
import { downloadGitHubZipball } from "@/lib/github";
import { MAX_REPO_SIZE_BYTES } from "@/lib/limits";

export function githubFullName(project: {
  name: string;
  repositoryUrl: string | null;
}): string | null {
  if (project.name.includes("/")) return project.name;

  const match = project.repositoryUrl?.match(
    /github\.com\/([^/]+\/[^/#?]+)/i,
  );

  return match?.[1]?.replace(/\.git$/i, "") ?? null;
}

export async function refreshProjectSources(project: {
  id: string;
  userId: string;
  name: string;
  source: "github" | "upload";
  repositoryUrl: string | null;
}): Promise<void> {
  if (project.source !== "github") return;

  const fullName = githubFullName(project);

  if (!fullName) {
    throw new Error(
      "Could not determine the GitHub repository for this project.",
    );
  }

  const user = await prisma.user.findUnique({
    where: { id: project.userId },
    select: { githubAccessToken: true },
  });

  if (!user?.githubAccessToken) {
    throw new Error(
      "Connect GitHub in Settings before re-analyzing this repository.",
    );
  }

  await setProjectProgress(project.id, {
    step: "Fetching latest code from GitHub",
    percent: 10,
    status: "processing",
    errorMessage: null,
  });

  const zipBuffer = await downloadGitHubZipball(user.githubAccessToken, fullName);

  if (zipBuffer.byteLength > MAX_REPO_SIZE_BYTES) {
    throw new Error(
      `Repository archive exceeds the ${
        MAX_REPO_SIZE_BYTES / (1024 * 1024)
      } MB limit.`,
    );
  }

  await setProjectProgress(project.id, {
    step: "Reading updated files",
    percent: 18,
    status: "processing",
  });

  const extracted = await extractFromZipBuffer(zipBuffer, {
    stripRoot: true,
  });

  if (!extracted.ok) {
    throw new Error(extracted.error);
  }

  const framework = detectFramework(
    extracted.sourceFiles,
    extracted.allRelativePaths,
  );

  const sourceOnly = extracted.sourceFiles.filter((file) =>
    isSourceFile(file.relativePath),
  );

  await deleteProjectFiles(project.id);
  await persistProjectFiles(project.id, extracted.sourceFiles);

  await setProjectProgress(project.id, {
    step: "Files ready for analysis",
    percent: 25,
    status: "queued",
    framework,
    fileCount: sourceOnly.length,
    errorMessage:
      extracted.skippedLargeFiles.length > 0
        ? `Skipped ${extracted.skippedLargeFiles.length} file(s) over the size limit.`
        : null,
  });
}