export type Role = 'USER' | 'ADMIN' | 'SUPERADMIN';
export interface AdminUser {
	id: number;
	name: string | null;
	email: string;
	role: Role;
	email_verified_at?: string | null;
}
export interface AuthResponse {
	access_token: string;
	user: AdminUser;
}
export interface AuditEvent {
	id: number;
	actorEmail: string | null;
	targetEmail: string;
	fromRole: Role;
	toRole: Role;
	reason: string;
	createdAt: string;
	action: string;
}
