'use client';
import { createContext, useContext, useEffect, useState, useRef } from 'react';
import { check, login, logout } from '@/src/app/api/auth/auth.api';
import { refreshAccessToken } from '@/src/app/api/client';
import { clearAccessToken, setAccessToken } from '@/src/app/api/auth/auth-token';
import type { AdminUser } from '@/src/app/api/auth/auth.types';
interface Auth {
	initialized: boolean;
	user: AdminUser | null;
	signIn: (email: string, password: string) => Promise<void>;
	signOut: () => Promise<void>;
}
const Context = createContext<Auth | null>(null);
export const useAuth = () => {
	const value = useContext(Context);
	if (!value) throw new Error('AuthProvider required');
	return value;
};
export default function AuthProvider({ children }: { children: React.ReactNode }) {
	const [user, setUser] = useState<AdminUser | null>(null);
	const [initialized, setInitialized] = useState(false);
	const generation = useRef(0);
	useEffect(() => {
		let cancelled = false;
		const version = generation.current;
		const expire = () => {
			generation.current++;
			setUser(null);
			clearAccessToken();
		};
		window.addEventListener('admin-session-expired', expire);
		if (window.location.pathname === '/preview') {
			setInitialized(true);
			return () => window.removeEventListener('admin-session-expired', expire);
		}
		(async () => {
			try {
				await refreshAccessToken();
				const result = await check();
				if (!cancelled && version === generation.current) setUser(result.user);
			} catch {
				if (!cancelled && version === generation.current) clearAccessToken();
			} finally {
				if (!cancelled) setInitialized(true);
			}
		})();
		return () => {
			cancelled = true;
			window.removeEventListener('admin-session-expired', expire);
		};
	}, []);
	async function signIn(email: string, password: string) {
		generation.current++;
		clearAccessToken();
		const result = await login(email, password);
		setAccessToken(result.access_token);
		try {
			const verified = await check();
			setUser(verified.user);
			setInitialized(true);
		} catch (error) {
			clearAccessToken();
			setUser(null);
			throw error;
		}
	}
	async function signOut() {
		generation.current++;
		try {
			await logout();
		} finally {
			clearAccessToken();
			setUser(null);
		}
	}
	return <Context.Provider value={{ initialized, user, signIn, signOut }}>{children}</Context.Provider>;
}
