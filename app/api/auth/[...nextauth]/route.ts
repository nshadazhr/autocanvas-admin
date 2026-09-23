import { handlers } from "@platform/auth";

// Same one-liner as apps/web's route of the same name — both apps delegate
// entirely to the shared Auth.js config in packages/auth. See that
// package's config.ts for the session/JWT strategy notes.
export const { GET, POST } = handlers;
