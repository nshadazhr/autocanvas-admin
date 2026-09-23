import { listProviders, toggleModelActive, toggleProviderActive } from "./actions";

// Flipping isActive here is read by packages/ai-core's registry
// (src/audio/registry.ts) at provider-selection time on every job — no
// deploy, no restart, takes effect on the very next job that looks the
// provider/model up. A provider going inactive doesn't touch models still
// marked active underneath it; the registry's lookup checks the provider
// row itself, so an inactive provider's models simply become unreachable
// until the provider is re-enabled (this page doesn't force-disable them,
// to avoid losing an admin's per-model choices).
export default async function ProvidersPage() {
  const providers = await listProviders();

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">AI Providers</h1>
        <p className="text-sm text-slate-500">
          Toggling a provider or model here takes effect immediately — no deploy needed.
        </p>
      </div>

      {providers.length === 0 ? (
        <p className="text-sm text-slate-500">No AI providers registered yet.</p>
      ) : (
        <div className="space-y-6">
          {providers.map((provider) => (
            <div key={provider.id} className="rounded-lg border border-slate-200">
              <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-4 py-3">
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    {provider.name}{" "}
                    <span className="font-mono text-xs font-normal text-slate-500">({provider.key})</span>
                  </p>
                  <p className="text-xs text-slate-500">module: {provider.module}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      provider.isActive ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {provider.isActive ? "Active" : "Inactive"}
                  </span>
                  <form
                    action={async () => {
                      "use server";
                      await toggleProviderActive(provider.id);
                    }}
                  >
                    <button
                      type="submit"
                      className="rounded-md border border-slate-300 px-3 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100"
                    >
                      {provider.isActive ? "Disable" : "Enable"}
                    </button>
                  </form>
                </div>
              </div>

              {provider.models.length === 0 ? (
                <p className="px-4 py-3 text-sm text-slate-500">No models registered under this provider.</p>
              ) : (
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="text-left text-slate-500">
                      <th className="py-2 pl-4 pr-4 font-medium">Model</th>
                      <th className="py-2 pr-4 font-medium">Cost / unit</th>
                      <th className="py-2 pr-4 font-medium">Status</th>
                      <th className="py-2 pr-4 font-medium"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {provider.models.map((model) => (
                      <tr key={model.id} className="border-t border-slate-100">
                        <td className="py-2 pl-4 pr-4">
                          <span className="text-slate-900">{model.name}</span>{" "}
                          <span className="font-mono text-xs text-slate-500">({model.key})</span>
                        </td>
                        <td className="py-2 pr-4 text-slate-600">{String(model.costPerUnit)}</td>
                        <td className="py-2 pr-4">
                          <span
                            className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                              model.isActive ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-500"
                            }`}
                          >
                            {model.isActive ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td className="py-2 pr-4">
                          <form
                            action={async () => {
                              "use server";
                              await toggleModelActive(model.id);
                            }}
                          >
                            <button
                              type="submit"
                              className="rounded-md border border-slate-300 px-3 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100"
                            >
                              {model.isActive ? "Disable" : "Enable"}
                            </button>
                          </form>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
