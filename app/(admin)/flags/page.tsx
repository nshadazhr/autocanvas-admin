import { listFeatureFlags, toggleFeatureFlag } from "./actions";

// This is the payoff for the "isActive flags with no deploy needed" promise
// made back in Chunk 5's README (packages/ai-core) — flipping a flag here
// updates the DB row directly, no redeploy, no env var change. Feature
// flags gate whole modules ("audio_v1", "script_v1", ...); AI Providers/
// Models (../providers) gate individual providers/models within a module —
// two different levers at two different granularities.
export default async function FeatureFlagsPage() {
  const flags = await listFeatureFlags();

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Feature Flags</h1>
        <p className="text-sm text-slate-500">Toggle whole modules on/off with no deploy needed.</p>
      </div>

      {flags.length === 0 ? (
        <p className="text-sm text-slate-500">No feature flags defined yet.</p>
      ) : (
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-left text-slate-500">
              <th className="py-2 pr-4 font-medium">Key</th>
              <th className="py-2 pr-4 font-medium">Description</th>
              <th className="py-2 pr-4 font-medium">Status</th>
              <th className="py-2 pr-4 font-medium">Last updated</th>
              <th className="py-2 pr-4 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {flags.map((flag) => (
              <tr key={flag.id} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="py-2 pr-4 font-mono text-xs text-slate-900">{flag.key}</td>
                <td className="py-2 pr-4 text-slate-600">{flag.description ?? "—"}</td>
                <td className="py-2 pr-4">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      flag.isEnabled ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {flag.isEnabled ? "Enabled" : "Disabled"}
                  </span>
                </td>
                <td className="py-2 pr-4 text-slate-500">{new Date(flag.updatedAt).toLocaleString()}</td>
                <td className="py-2 pr-4">
                  <form
                    action={async () => {
                      "use server";
                      await toggleFeatureFlag(flag.id);
                    }}
                  >
                    <button
                      type="submit"
                      className="rounded-md border border-slate-300 px-3 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100"
                    >
                      {flag.isEnabled ? "Disable" : "Enable"}
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
