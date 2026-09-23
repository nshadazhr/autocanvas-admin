"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@platform/database";
import { requireAdminSession, type ActionResult } from "../../lib/admin-guard";

export interface AiModelRow {
  id: string;
  key: string;
  name: string;
  costPerUnit: unknown; // Prisma.Decimal — rendered via String(), never used for math here
  isActive: boolean;
}

export interface AiProviderRow {
  id: string;
  key: string;
  name: string;
  module: string;
  isActive: boolean;
  models: AiModelRow[];
}

export async function listProviders(): Promise<AiProviderRow[]> {
  await requireAdminSession("admin:manage_providers");
  const providers = await prisma.aiProvider.findMany({
    include: { models: { orderBy: { key: "asc" } } },
    orderBy: [{ module: "asc" }, { key: "asc" }],
  });
  return providers as AiProviderRow[];
}

// Read-then-flip, same reasoning as toggleFeatureFlag in ../flags/actions.ts.
export async function toggleProviderActive(providerId: string): Promise<ActionResult<{ isActive: boolean }>> {
  await requireAdminSession("admin:manage_providers");
  try {
    const current = await prisma.aiProvider.findUniqueOrThrow({ where: { id: providerId } });
    const updated = await prisma.aiProvider.update({
      where: { id: providerId },
      data: { isActive: !current.isActive },
    });
    revalidatePath("/providers");
    return { ok: true, data: { isActive: updated.isActive } };
  } catch (err) {
    return { ok: false, message: err instanceof Error ? err.message : "Failed to toggle provider." };
  }
}

export async function toggleModelActive(modelId: string): Promise<ActionResult<{ isActive: boolean }>> {
  await requireAdminSession("admin:manage_providers");
  try {
    const current = await prisma.aiModel.findUniqueOrThrow({ where: { id: modelId } });
    const updated = await prisma.aiModel.update({
      where: { id: modelId },
      data: { isActive: !current.isActive },
    });
    revalidatePath("/providers");
    return { ok: true, data: { isActive: updated.isActive } };
  } catch (err) {
    return { ok: false, message: err instanceof Error ? err.message : "Failed to toggle model." };
  }
}
