import { api } from '../client';
import type { AdminUser, AuthResponse } from './auth.types';
export const login = (email: string, password: string) =>
	api<AuthResponse>(
		'/auth/admin/login',
		{ method: 'POST', body: JSON.stringify({ email, password }) },
		false
	);
export const check = () => api<{ success: boolean; user: AdminUser }>('/auth/admin/check');
export const logout = () => api('/auth/admin/logout', { method: 'POST', body: '{}' }, false);
