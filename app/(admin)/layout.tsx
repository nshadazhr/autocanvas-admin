import type { ReactNode } from "react";
import Link from "next/link";
import { auth, signOut } from "@platform/auth";

const NAV_LINKS = [
  { href: "/jobs", label: "Jobs" },
  { href: "/jobs/failed", label: "Failed Jobs" },
  { href: "/flags", label: "Feature Flags" },
  { href: "/providers", label: "AI Providers" },
];

// Wraps every real admin page (jobs, flags, providers — everything except
// /login and /forbidden, which intentionally stay outside this group so a
// signed-out or non-admin visitor never sees admin nav links). By the time
// this layout runs, middleware.ts has already confirmed the session exists
// and the role is ADMIN/SUPER_ADMIN — this just renders the shell.
export default async function AdminShellLayout({ children }: { children: ReactNode }) {
  const session = await auth();

  return (
    <div className="flex min-h-screen">
      <aside className="w-56 shrink-0 border-r border-slate-200 bg-white px-4 py-6">
        <p className="mb-6 text-sm font-semibold text-slate-900">Admin console</p>
        <nav className="flex flex-col gap-1">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-md px-3 py-2 text-sm text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="mt-8 border-t border-slate-200 pt-4">
          <p className="truncate text-xs text-slate-500">{session?.user?.email}</p>
          <p className="mb-2 text-xs text-slate-400">{session?.user?.role}</p>
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/login" });
            }}
          >
            <button type="submit" className="text-xs text-slate-500 underline hover:text-slate-900">
              Sign out
            </button>
          </form>
        </div>
      </aside>
      <main className="flex-1 px-8 py-8">{children}</main>
    </div>
  );
}
