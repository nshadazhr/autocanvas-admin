import { auth } from "@platform/auth";
import { NextResponse } from "next/server";

// Route protection for every admin page. Two checks, not one — being signed
// in is not the same as being allowed in here:
//   1. Signed in at all (same pattern as apps/web's middleware.ts).
//   2. Platform role is ADMIN or SUPER_ADMIN — a regular creator account
//      that happens to guess /jobs's URL gets bounced to /forbidden, not
//      shown an empty page or a 500. This mirrors `@platform/auth`'s own
//      `PLATFORM_ADMIN_ACTIONS` gate (rbac.ts) so the two checks can never
//      drift apart — this middleware is a UX convenience (redirect early,
//      don't even render the page), the real enforcement is still every
//      Server Action's own `requireAuthorized(..., "admin:manage_*")` call.
const PUBLIC_PATHS = ["/login"];

export default auth((req) => {
  const isPublic = PUBLIC_PATHS.some((path) => req.nextUrl.pathname.startsWith(path));
  const isLoggedIn = Boolean(req.auth?.user);
  const role = req.auth?.user?.role;
  const isAdmin = role === "ADMIN" || role === "SUPER_ADMIN";

  if (!isLoggedIn && !isPublic) {
    const loginUrl = new URL("/login", req.nextUrl.origin);
    loginUrl.searchParams.set("callbackUrl", req.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isLoggedIn && isPublic) {
    return NextResponse.redirect(new URL("/jobs", req.nextUrl.origin));
  }

  if (isLoggedIn && !isAdmin && req.nextUrl.pathname !== "/forbidden") {
    return NextResponse.redirect(new URL("/forbidden", req.nextUrl.origin));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api/auth|_next/static|_next/image|favicon.ico).*)"],
};
