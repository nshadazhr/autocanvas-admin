import { redirect } from "next/navigation";

// This app has no real "home" content — Jobs is the natural landing page
// for an ops console (it's the thing most likely to need attention). The
// role/auth check already happened in middleware.ts before this ever runs.
export default function AdminRootPage() {
  redirect("/jobs");
}
