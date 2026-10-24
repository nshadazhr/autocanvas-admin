import { api } from '../client';
import type { AdminUser, AuditEvent, Role } from '../auth/auth.types';
export function listUsers(
	query: { search?: string; role?: string; cursor?: number; limit: number },
	signal?: AbortSignal
) {
	const params = new URLSearchParams();
	Object.entries(query).forEach(([key, value]) => {
		if (value !== undefined && value !== '') params.set(key, String(value));
	});
	return api<{ users: AdminUser[]; nextCursor: number | null }>('/auth/admin/users?' + params, { signal });
}
export const listAudit = (limit: number, cursor?: number, signal?: AbortSignal) =>
	api<{ events: AuditEvent[]; nextCursor: number | null }>(
		`/auth/admin/role-audit?limit=${limit}${cursor ? `&cursor=${cursor}` : ''}`,
		{ signal }
	);
export const changeRole = (id: number, role: Role, reason: string) =>
	api<{ user: AdminUser; changed: boolean }>(`/auth/admin/users/${id}/role`, {
		method: 'PATCH',
		body: JSON.stringify({ role, reason })
	});
