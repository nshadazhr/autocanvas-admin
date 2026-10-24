import { getStrings } from '@/src/lib/appResolvers';
import { getAccessToken, setAccessToken, clearAccessToken, getAuthEpoch } from './auth/auth-token';
const s = getStrings();
const base = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000').replace(/\/$/, '');
export class ApiError extends Error {
	constructor(
		message: string,
		public status: number,
		public retryAfter: number | null = null
	) {
		super(message);
	}
}
let refreshPromise: Promise<string> | null = null;
async function decode(response: Response) {
	const body = await response.json().catch(() => null);
	if (!response.ok) {
		const message = Array.isArray(body?.message) ? body.message.join('. ') : body?.message;
		throw new ApiError(
			typeof message === 'string'
				? message
				: s(response.status === 403 ? 'forbidden' : response.status === 401 ? 'sessionExpired' : 'error'),
			response.status,
			Number(response.headers.get('Retry-After')) || null
		);
	}
	return body;
}
export function refreshAccessToken(): Promise<string> {
	if (!refreshPromise) {
		const epoch = getAuthEpoch();
		refreshPromise = fetch(base + '/auth/admin/refresh', {
			method: 'POST',
			credentials: 'include',
			headers: { 'Content-Type': 'application/json' },
			body: '{}'
		})
			.then(decode)
			.then((body) => {
				if (epoch !== getAuthEpoch() || typeof body?.access_token !== 'string')
					throw new ApiError(s('sessionExpired'), 401);
				setAccessToken(body.access_token);
				return body.access_token as string;
			})
			.finally(() => {
				refreshPromise = null;
			});
	}
	return refreshPromise;
}
export async function api<T>(path: string, options: RequestInit = {}, authenticated = true): Promise<T> {
	const send = () =>
		fetch(base + path, {
			...options,
			credentials: 'include',
			cache: 'no-store',
			headers: {
				'Content-Type': 'application/json',
				...options.headers,
				...(authenticated && getAccessToken() ? { Authorization: `Bearer ${getAccessToken()}` } : {})
			}
		});
	let response: Response;
	try {
		response = await send();
	} catch {
		throw new ApiError(s('networkError'), 0);
	}
	if (response.status === 401 && authenticated) {
		try {
			await refreshAccessToken();
			response = await send();
		} catch (error) {
			if (error instanceof ApiError && [401, 403].includes(error.status)) {
				clearAccessToken();
				window.dispatchEvent(new Event('admin-session-expired'));
			}
			throw error;
		}
	}
	if (authenticated && [401, 403].includes(response.status) && path === '/auth/admin/check') {
		clearAccessToken();
		window.dispatchEvent(new Event('admin-session-expired'));
	}
	return decode(response);
}
