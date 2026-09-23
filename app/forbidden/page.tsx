import { auth, signOut } from "@platform/auth";

// Where middleware.ts sends any signed-in-but-not-admin user. Deliberately
// not the /login page — they ARE signed in, correctly, just not into an
// account that's allowed in here. Re-showing a login form would be
// confusing (their credentials aren't wrong).
export default async function ForbiddenPage() {
  const session = await auth();

  return (
    <main className="mx-auto mt-24 max-w-md px-6 text-center">
      <h1 className="mb-2 text-2xl font-semibold">Not authorized</h1>
      <p className="mb-6 text-sm text-slate-500">
        {session?.user?.email ?? "This account"} doesn't have admin access. If you believe this is a mistake, ask a
        super admin to update your role.
      </p>
      <form
        action={async () => {
          "use server";
          await signOut({ redirectTo: "/login" });
        }}
      >
        <button type="submit" className="text-sm text-slate-600 underline hover:text-slate-900">
          Sign out
        </button>
      </form>
    </main>
  );
}
