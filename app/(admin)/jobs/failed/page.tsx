import Link from "next/link";
import { listFailedJobs, retryJob } from "../actions";
import { StatusBadge } from "../status-badge";

// Everything here is already FAILED (see actions.ts's listFailedJobs), so
// unlike the main Jobs list this page's whole reason to exist is the Retry
// button — the workflow this page exists to unblock is packages/queue's
// retryFailedJob(): re-reserve credits + push a brand-new Job with the same
// module/jobType/payload (see packages/queue/src/retry.ts). The old row
// stays FAILED as a permanent audit record; a successful retry shows up as
// a new row on the main Jobs list, not a status change here.
export default async function FailedJobsPage() {
  const jobs = await listFailedJobs();

  return (
    <div>
      <div className="mb-6 flex items-baseline justify-between">
        <h1 className="text-2xl font-semibold">Failed Jobs</h1>
        <p className="text-sm text-slate-500">
          Retrying re-reserves credits and queues a brand-new job — this row stays as the audit record.
        </p>
      </div>

      {jobs.length === 0 ? (
        <p className="text-sm text-slate-500">No failed jobs. 🎉</p>
      ) : (
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-left text-slate-500">
              <th className="py-2 pr-4 font-medium">Module / Type</th>
              <th className="py-2 pr-4 font-medium">Status</th>
              <th className="py-2 pr-4 font-medium">Attempts</th>
              <th className="py-2 pr-4 font-medium">Error</th>
              <th className="py-2 pr-4 font-medium">User</th>
              <th className="py-2 pr-4 font-medium">Queued</th>
              <th className="py-2 pr-4 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((job) => (
              <tr key={job.id} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="py-2 pr-4">
                  <Link href={`/jobs/${job.id}`} className="text-slate-900 hover:underline">
                    {job.module} · {job.jobType}
                  </Link>
                </td>
                <td className="py-2 pr-4">
                  <StatusBadge status={job.status} />
                </td>
                <td className="py-2 pr-4 text-slate-600">
                  {job.attempts} / {job.maxAttempts}
                </td>
                <td className="max-w-xs truncate py-2 pr-4 text-red-700" title={job.error ?? undefined}>
                  {job.error ?? "—"}
                </td>
                <td className="py-2 pr-4 text-slate-600">{job.user?.email ?? "—"}</td>
                <td className="py-2 pr-4 text-slate-500">{new Date(job.queuedAt).toLocaleString()}</td>
                <td className="py-2 pr-4">
                  <form
                    action={async () => {
                      "use server";
                      await retryJob(job.id);
                    }}
                  >
                    <button
                      type="submit"
                      className="rounded-md bg-slate-900 px-3 py-1 text-xs font-medium text-white hover:bg-slate-700"
                    >
                      Retry
                    </button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
