import { auth, requireAuthorized, type Action } from "@platform/auth";

// Shared by every Server Action file under app/(admin)/* — one place that
// does "must be signed in, AND must be allowed to perform this specific
// admin action" before any admin mutation runs. middleware.ts already
// bounces non-admins away from these pages at the route level, but Server
// Actions are callable directly (not just via page navigation), so this is
// the real enforcement point, not just a UX nicety — same principle as
// apps/web's actions.ts calling `requireAuthorized` in every mutation
// instead of trusting that the page that rendered the button already
// checked.
export async function requireAdminSession(action: Action) {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Not signed in.");
  }
  requireAuthorized({ platformRole: session.user.role }, action);
  return session;
}

export interface ActionResult<T = void> {
  ok: boolean;
  message?: string;
  data?: T;
}
