import type { StringKey } from '@/src/lib/appResolvers';
export const navigation: {
	group: StringKey;
	items: { key: StringKey; href: string; superOnly?: boolean }[];
}[] = [
	{ group: 'overview', items: [{ key: 'dashboard', href: '/dashboard' }] },
	{
		group: 'management',
		items: [
			{ key: 'users', href: '/users', superOnly: true },
			{ key: 'projects', href: '/projects' }
		]
	},
	{
		group: 'studio',
		items: [
			{ key: 'audio', href: '/audio-jobs' },
			{ key: 'analysis', href: '/analysis-jobs' },
			{ key: 'providers', href: '/providers' }
		]
	},
	{
		group: 'system',
		items: [
			{ key: 'settings', href: '/settings' },
			{ key: 'flags', href: '/feature-flags' },
			{ key: 'storage', href: '/storage' }
		]
	},
	{
		group: 'security',
		items: [
			{ key: 'admins', href: '/admins', superOnly: true },
			{ key: 'audit', href: '/audit', superOnly: true }
		]
	}
];
