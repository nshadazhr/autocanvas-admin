"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@platform/database";
import { retryFailedJob } from "@platform/queue";
import { requireAdminSession, type ActionResult } from "../../lib/admin-guard";

// Re-declared locally as a string-literal union rather than imported from
// the generated Prisma client — same reasoning as `SceneStatus` in
// `@modules/audio` and every other prisma-any-stub workaround in this repo
// (see apps/web/app/audio/actions.ts): this package can't assume the real
// Prisma client is generated, so it never imports enum *types* from it.
export type JobStatusValue = "QUEUED" | "PROCESSING" | "COMPLETED" | "FAILED" | "RETRYING" | "CANCELED";

export interface JobListRow {
  id: string;
  module: string;
  jobType: string;
  status: JobStatusValue;
  attempts: number;
  maxAttempts: number;
  creditsReserved: number;
  creditsConsumed: number;
  provider: string | null;
  model: string | null;
  error: string | null;
  queuedAt: Date;
  startedAt: Date | null;
  finishedAt: Date | null;
  user: { email: string } | null;
}

export interface JobAttemptRow {
  id: string;
  attemptNumber: number;
  status: JobStatusValue;
  error: string | null;
  startedAt: Date | null;
  finishedAt: Date | null;
}

export interface JobDetail extends JobListRow {
  payload: unknown;
  userId: string;
  projectId: string | null;
  attemptLogs: JobAttemptRow[];
}

// No true pagination yet — 100 most-recent jobs is enough for an ops
// console at this stage. Worth revisiting once job volume actually
// warrants it (cursor pagination + a search box), but that's a real
// follow-up, not something to fake with client-side slicing here.
const RECENT_JOBS_LIMIT = 100;

export async function listJobs(status?: JobStatusValue): Promise<JobListRow[]> {
  await requireAdminSession("admin:manage_jobs");
  const jobs = await prisma.job.findMany({
    where: status ? { status } : undefined,
    include: { user: { select: { email: true } } },
    orderBy: { queuedAt: "desc" },
    take: RECENT_JOBS_LIMIT,
  });
  return jobs as JobListRow[];
}

export async function listFailedJobs(): Promise<JobListRow[]> {
  return listJobs("FAILED");
}

export async function getJobDetail(jobId: string): Promise<JobDetail> {
  await requireAdminSession("admin:manage_jobs");
  const job = await prisma.job.findUniqueOrThrow({
    where: { id: jobId },
    include: {
      user: { select: { email: true } },
      attemptLogs: { orderBy: { attemptNumber: "asc" } },
    },
  });
  return job as JobDetail;
}

/**
 * Re-reserves credits and pushes a brand-new job with the same
 * module/jobType/payload — see packages/queue/src/retry.ts for why this
 * creates a new Job row rather than resurrecting the failed one in place.
 */
export async function retryJob(jobId: string): Promise<ActionResult<{ newJobId: string }>> {
  await requireAdminSession("admin:manage_jobs");
  try {
    const result = await retryFailedJob(jobId);
    revalidatePath("/jobs");
    revalidatePath("/jobs/failed");
    return { ok: true, data: { newJobId: result.jobId } };
  } catch (err) {
    return { ok: false, message: err instanceof Error ? err.message : "Failed to retry job." };
  }
}
