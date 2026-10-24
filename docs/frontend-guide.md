# Admin frontend maintenance guide

## Structure and reuse

This project follows autocanvas-web's directory conventions, with admin-specific
implementation and no cross-repository imports:

- `src/app/(auth)/login/`: administrator password login.
- `src/app/(app)/`: guarded dashboard and management routes.
- `src/app/preview/`: public design preview, sample fixtures only.
- `src/app/api/auth/`, `src/app/api/admin/`, `src/app/api/client.ts`: typed backend
  access, refresh handling and in-memory token storage.
- `src/appDefaults/localStrings.ts`, `localAppSettings.ts`: shared copy/defaults.
- `src/lib/appResolvers/`, `src/hooks/`: override-capable resolvers and hooks.
- `src/providers/`: theme and authentication providers. The old singular
  `src/provider/ThemeProvider.tsx` re-exports the provider for compatibility.
- `src/components/ui/`, `layout/`, `dashboard/`, `admin/`: reusable controls,
  navigation shell and screen components.

There is no live admin configuration/string service yet. Override support in
resolvers is a local extension point. Keep UI copy out of feature components;
keep backend identifiers and user content separate from display strings.

## Theme and responsive behavior

Reuse the existing next-themes provider. `light`, `dark`, `system` are persisted
by next-themes, and system mode follows device appearance. CSS variables in
`src/app/globals.css` define shared surfaces, text, borders and semantic colors.
Tailwind still uses the same variables. Select existing shared components and
semantic CSS classes before duplicating styles. Do not create another theme
store or copy fixed page colors to every component.

The layout has an off-canvas sidebar on phones, stacked cards/charts, bounded
table scrolling and a native modal role dialog. All new or changed UI must work
on narrow phones (360–393px), tablets and desktop. Prevent page horizontal
scroll, clipped controls, overlap and inaccessible content. Support touch,
keyboard focus, Escape dismissal and reduced motion. Global page search finds
navigation entries; desktop Command/Ctrl+K focuses it. It is not a user/job search.

## Authentication and authorization

Login uses `/auth/admin/login`; refresh/check/logout use the corresponding admin
routes. Access tokens remain in memory. The HttpOnly admin refresh cookie is
sent with credentials. Parallel 401s share a refresh promise; a generation check
prevents a late refresh from restoring tokens after local sign-out. Session
initialization completes before protected UI renders. Logout clears local state
in a finally block even if the backend is unreachable; in that case server-side
revocation is not guaranteed until logout succeeds or the session expires.

User-list, role management and audit pages are SUPERADMIN-only. Ordinary ADMIN
accounts can use the shell/dashboard but those navigation items are hidden and
direct navigation displays forbidden. Backend guards remain authoritative.
Role edits require a 5–500 character trimmed reason, prevent duplicate submits
and show backend errors. Backend role changes revoke the target's old sessions.
Changing your own role signs you out. No public account bootstrap or registration
was added to the admin UI.

Set `NEXT_PUBLIC_API_URL` to the backend origin without `/api`; the local default
is `http://localhost:4000`. Configure the backend's `ADMIN_ORIGIN` to the frontend
origin. Deploy on HTTPS with the backend cookie/CORS configuration. Do not put
server secrets in public environment variables. See the backend repository's
`docs/admin-auth.md` for the authoritative session and role contract.

## Implemented versus pending

Implemented: login/session restore/logout; users search and role filter with
cursor pagination; administrator role edits; paginated audit history; theme
modes; responsive shell, charts/cards in design preview.

Reporting, project management, audio/analysis job management, provider controls,
global settings, feature flag editing and storage administration need dedicated
admin backend APIs. These routes deliberately show unavailable states, not mock
successful actions. The signed-in dashboard uses unavailable reporting states;
it never substitutes preview figures for real totals. Account search supports
only existing backend fields and does not imply a total user count.

`/preview` is a public, read-only design surface with explicit sample-data
labelling and no management mutations. `src/lib/dashboard-preview.ts` contains
fixtures. The preview skips authentication restore on direct entry. Set
`enableDesignPreview` to false in local settings to disable that route and link.
Preview availability is a UI setting, not an authorization control.

## Verification

From the admin repository:

```sh
npm run typecheck
npm run build
```

Stop the development server before building; both use `.next`.
Browser verification for this implementation used an isolated temporary server
on port 3101 and mocked admin API responses, not live administrator accounts.
Checks passed for light/dark screenshots, OS-following system mode, 360/393/768px
page overflow, mobile navigation, protected-route redirect, password login,
role-edit dialog, audit rendering and sign-out. Typecheck and production build
also passed. Live backend integration and deployment are not established by
those fixture-based browser checks. Recheck real login with a configured backend
and an existing authorized account when deploying.

Follow [../AGENTS.md](../AGENTS.md): migrate only affected code on the requested
page, preserve other consumers and update documentation with final behavior.
