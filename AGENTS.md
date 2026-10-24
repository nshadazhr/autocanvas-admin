# Documentation rules

After every code change:

- Check whether existing documentation needs updating before completing the task.
- Update affected docs when behavior, APIs, auth, configuration, database,
  storage, or setup changes. Keep documentation consistent with the final code.
- Reuse existing documentation; avoid duplicate documents and unnecessary edits.
- Clearly separate implemented and planned features.
- Never include secrets, tokens, or real credentials.
- Verify links and commands in updated documentation. Report any commands that
  could not be verified; do not claim they were tested.
- In the final response, mention which docs changed. If documentation needs no
  changes, briefly explain why.

Start with README.md for the documentation index. Update the relevant existing
guide in docs/ and update the index if documentation is added or moved.

# Admin frontend maintenance rules

- Before changing a page, read the relevant documentation and inspect existing
  code, shared components and theme conventions.
- Migrate hardcoded user-facing copy, shared product settings and duplicated
  shared styling only in the affected code of the page the user requests to
  change. Do not proactively migrate other pages or rewrite the whole project.
- Reuse existing shared strings, configuration, components and theme facilities
  where available. If missing, add only the minimal shared facility needed by
  the requested page; do not assume the user web project's modules exist here.
  Shared-file changes must preserve other consumers.
- Keep dynamic user content and API status identifiers separate from display
  strings. Keep deployment values in environment configuration and secrets on
  the server. UI flags and hidden navigation do not enforce permissions.
- Reuse existing admin API/auth infrastructure when available; keep admin
  sessions separate from normal user sessions. Follow the backend auth contract
  documented in README.md rather than creating another authentication system.
- Preserve loading, empty, error, success and disabled states, accessibility,
  keyboard focus, mobile/desktop layout and existing scroll ownership.
- Update affected documentation with the final behavior and verify changes with
  appropriate checks. Report relevant remaining gaps without expanding scope.

# Responsive UI requirement

- Every new or changed UI must work on mobile as well as desktop. Check a narrow
  phone viewport (around 360–393px), tablet and desktop widths before completion.
- Prevent page-level horizontal overflow, clipped text/actions and overlapping
  controls. Stack or wrap layouts and make forms, navigation and dialogs usable
  by touch and keyboard. Wide data tables may scroll within their own container.
- Preserve intentional scroll ownership; do not conceal inaccessible content
  with overflow hiding. Report viewport checks that could not be performed.
