import Link from "next/link";
import { getJobDetail } from "../actions";
import { StatusBadge } from "../status-badge";

// Detail view for a single job — mirrors the level of detail apps/web's
// Audio Studio project detail page gives to scenes/exports: every field on
// the row itself, the full payload (for debugging what was actually sent
// to the provider), and the full attempt history (so a FAILED job's story —
// how many times it was tried, what each attempt's error was — is visible
// without needing direct DB/log access).
export default async function JobDetailPage({ params }: { params: { jobId: string } }) {
  const job = await getJobDetail(params.jobId);

  return (
    <div>
      <div className="mb-6">
        <Link href="/jobs" className="text-sm text-slate-500 hover:underline">
          ← Back to Jobs
        </Link>
      </div>

      <div className="mb-6 flex items-baseline justify-between">
        <h1 className="text-2xl font-semibold">
          {job.module} · {job.jobType}
        </h1>
        <StatusBadge status={job.status} />
      </div>

      <dl className="mb-8 grid grid-cols-2 gap-4 rounded-lg border border-slate-200 p-4 text-sm sm:grid-cols-3">
        <div>
          <dt className="text-slate-500">Job ID</dt>
          <dd className="font-mono text-xs text-slate-900">{job.id}</dd>
        </div>
        <div>
          <dt className="text-slate-500">Attempts</dt>
          <dd className="text-slate-900">
            {job.attempts} / {job.maxAttempts}
          </dd>
        </div>
        <div>
          <dt className="text-slate-500">Credits (reserved / consumed)</dt>
          <dd className="text-slate-900">
            {job.creditsReserved} / {job.creditsConsumed}
          </dd>
        </div>
        <div>
          <dt className="text-slate-500">User</dt>
          <dd className="text-slate-900">{job.user?.email ?? "—"}</dd>
        </div>
        <div>
          <dt className="text-slate-500">Project ID</dt>
          <dd className="font-mono text-xs text-slate-900">{job.projectId ?? "—"}</dd>
        </div>
        <div>
          <dt className="text-slate-500">Provider / Model</dt>
          <dd className="text-slate-900">
            {job.provider ?? "—"} / {job.model ?? "—"}
          </dd>
        </div>
        <div>
          <dt className="text-slate-500">Queued</dt>
          <dd className="text-slate-900">{new Date(job.queuedAt).toLocaleString()}</dd>
        </div>
        <div>
          <dt className="text-slate-500">Started</dt>
          <dd className="text-slate-900">{job.startedAt ? new Date(job.startedAt).toLocaleString() : "—"}</dd>
        </div>
        <div>
          <dt className="text-slate-500">Finished</dt>
          <dd className="text-slate-900">{job.finishedAt ? new Date(job.finishedAt).toLocaleString() : "—"}</dd>
        </div>
      </dl>

      {job.error && (
        <div className="mb-8">
          <h2 className="mb-2 text-sm font-semibold text-slate-900">Error</h2>
          <pre className="overflow-x-auto rounded-lg bg-red-50 p-4 text-xs text-red-700">{job.error}</pre>
        </div>
      )}

      <div className="mb-8">
        <h2 className="mb-2 text-sm font-semibold text-slate-900">Payload</h2>
        <pre className="overflow-x-auto rounded-lg bg-slate-50 p-4 text-xs text-slate-700">
          {JSON.stringify(job.payload, null, 2)}
        </pre>
      </div>

      <div>
        <h2 className="mb-2 text-sm font-semibold text-slate-900">Attempt history</h2>
        {job.attemptLogs.length === 0 ? (
          <p className="text-sm text-slate-500">No attempts recorded yet.</p>
        ) : (
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-left text-slate-500">
                <th className="py-2 pr-4 font-medium">#</th>
                <th className="py-2 pr-4 font-medium">Status</th>
                <th className="py-2 pr-4 font-medium">Started</th>
                <th className="py-2 pr-4 font-medium">Finished</th>
                <th className="py-2 pr-4 font-medium">Error</th>
              </tr>
            </thead>
            <tbody>
              {job.attemptLogs.map((attempt) => (
                <tr key={attempt.id} className="border-b border-slate-100">
                  <td className="py-2 pr-4 text-slate-600">{attempt.attemptNumber}</td>
                  <td className="py-2 pr-4">
                    <StatusBadge status={attempt.status} />
                  </td>
                  <td className="py-2 pr-4 text-slate-500">
                    {attempt.startedAt ? new Date(attempt.startedAt).toLocaleString() : "—"}
                  </td>
                  <td className="py-2 pr-4 text-slate-500">
                    {attempt.finishedAt ? new Date(attempt.finishedAt).toLocaleString() : "—"}
                  </td>
                  <td className="py-2 pr-4 text-red-700">{attempt.error ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
