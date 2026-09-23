const STATUS_STYLES: Record<string, string> = {
  QUEUED: "bg-slate-100 text-slate-600",
  PROCESSING: "bg-blue-100 text-blue-700",
  RETRYING: "bg-amber-100 text-amber-700",
  COMPLETED: "bg-green-100 text-green-700",
  FAILED: "bg-red-100 text-red-700",
  CANCELED: "bg-slate-100 text-slate-500",
};

// Plain server-renderable span — no client interactivity needed, so this
// stays a regular (server) component rather than "use client", matching
// apps/web's AudioStudio StatusBadge convention (app/audio/[audioProjectId]/page.tsx).
export function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_STYLES[status] ?? "bg-slate-100 text-slate-600"}`}>
      {status}
    </span>
  );
}
