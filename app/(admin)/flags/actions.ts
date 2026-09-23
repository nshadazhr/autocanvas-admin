"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@platform/database";
import { requireAdminSession, type ActionResult } from "../../lib/admin-guard";

export interface FeatureFlagRow {
  id: string;
  key: string;
  isEnabled: boolean;
  description: string | null;
  updatedAt: Date;
}

export async function listFeatureFlags(): Promise<FeatureFlagRow[]> {
  await requireAdminSession("admin:manage_flags");
  const flags = await prisma.featureFlag.findMany({ orderBy: { key: "asc" } });
  return flags as FeatureFlagRow[];
}

/**
 * Reads the flag's current value and flips it, rather than taking a
 * desired-value argument from the client — same "read-then-flip" reasoning
 * as toggleProviderActive/toggleModelActive in ../providers/actions.ts:
 * two admins racing to toggle the same flag from two open tabs should each
 * still get an honest invert of the current DB row, not a stale value
 * captured whenever the page happened to load.
 */
export async function toggleFeatureFlag(flagId: string): Promise<ActionResult<{ isEnabled: boolean }>> {
  await requireAdminSession("admin:manage_flags");
  try {
    const current = await prisma.featureFlag.findUniqueOrThrow({ where: { id: flagId } });
    const updated = await prisma.featureFlag.update({
      where: { id: flagId },
      data: { isEnabled: !current.isEnabled },
    });
    revalidatePath("/flags");
    return { ok: true, data: { isEnabled: updated.isEnabled } };
  } catch (err) {
    return { ok: false, message: err instanceof Error ? err.message : "Failed to toggle flag." };
  }
}
