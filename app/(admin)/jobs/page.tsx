import Link from "next/link";
import { listJobs } from "./actions";
import { StatusBadge } from "./status-badge";

export default async function JobsPage() {
  const jobs = await listJobs();

  return (
    <div>
      <div className="mb-6 flex items-baseline justify-between">
        <h1 className="text-2xl font-semibold">Jobs</h1>
        <p className="text-sm text-slate-500">Most recent {jobs.length} — see "Failed Jobs" to retry.</p>
      </div>

      {jobs.length === 0 ? (
        <p className="text-sm text-slate-500">No jobs have been queued yet.</p>
      ) : (
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-left text-slate-500">
              <th className="py-2 pr-4 font-medium">Module / Type</th>
              <th className="py-2 pr-4 font-medium">Status</th>
              <th className="py-2 pr-4 font-medium">Attempts</th>
              <th className="py-2 pr-4 font-medium">Credits (reserved / consumed)</th>
              <th className="py-2 pr-4 font-medium">User</th>
              <th className="py-2 pr-4 font-medium">Queued</th>
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
                <td className="py-2 pr-4 text-slate-600">
                  {job.creditsReserved} / {job.creditsConsumed}
                </td>
                <td className="py-2 pr-4 text-slate-600">{job.user?.email ?? "—"}</td>
                <td className="py-2 pr-4 text-slate-500">{new Date(job.queuedAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
