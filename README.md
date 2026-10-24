# AutoCanvas Admin

Next.js administration UI on port **3001**, following autocanvas-web's project
structure and AutoCanvas visual language. Light, dark and system themes reuse
the existing next-themes setup. See [frontend guide](docs/frontend-guide.md) for
architecture, maintenance, auth behavior and verification limits.

## Local setup

```sh
npm ci
cp .env.example .env.local
npm run dev
```

Set `NEXT_PUBLIC_API_URL` to the backend origin (local default
`http://localhost:4000`, without `/api`). Start the backend separately and set its
`ADMIN_ORIGIN` to `http://localhost:3001` for local browser requests. The backend's
session/audit migrations must be applied before admin authentication works.

- `/login`: password login for existing ADMIN/SUPERADMIN accounts.
- `/dashboard`: protected shell and reporting availability.
- `/users`, `/admins`: SUPERADMIN-only account search/filter/pagination and roles.
- `/audit`: SUPERADMIN-only paginated role-change history.
- `/preview`: clearly labelled public design preview with sample data.

The dashboard's charts and example totals are available only in the design
preview. Live reporting APIs are not implemented. Projects, audio/analysis jobs,
providers, settings, feature flags and storage routes show explicit unavailable
states until corresponding admin APIs exist. No fake save/retry actions are used.

## Auth backend contract

See `docs/admin-auth.md` in autocanvas-api for full security/setup details.

| Purpose                      | Endpoint                             |
| ---------------------------- | ------------------------------------ |
| Login                        | POST /auth/admin/login               |
| Session restore              | POST /auth/admin/refresh             |
| Current identity/permissions | GET /auth/admin/check                |
| Sign out                     | POST /auth/admin/logout              |
| Account search               | GET /auth/admin/users                |
| Change role with reason      | PATCH /auth/admin/users/:userId/role |
| Role audit                   | GET /auth/admin/role-audit           |

Admin sessions are separate from normal user sessions. Access tokens stay in
memory; the backend manages its HttpOnly refresh cookie. All access is enforced
by backend guards. The first superadmin must be bootstrapped with the backend's
server-only command against an existing verified password account; installing
this UI does not create or promote an administrator. Never place JWT signing
secrets, database/provider credentials or service-role keys in browser code.

## Checks

```sh
npm run typecheck
npm run build
```

Stop the dev server before building because both use `.next`. Browser checks
covered desktop/mobile themes, system mode and auth/role/audit interactions with
mock API responses; this is not a live backend end-to-end verification.

## Maintenance rules

Follow [AGENTS.md](AGENTS.md). When a page is requested for changes, migrate only
its affected hardcoded strings/settings/shared styling. Reuse shared facilities;
preserve other pages, responsive behavior and auth separation. Update relevant
docs when behavior or setup changes.
