import { AppShell } from '@/src/components/layout/AppShell';
import { Dashboard } from '@/src/components/dashboard/Dashboard';
import { Unavailable } from '@/src/components/admin/Unavailable';
import { getAppSettings } from '@/src/lib/appResolvers';
import { notFound } from 'next/navigation';
import type { StringKey } from '@/src/lib/appResolvers';
const sections: Record<string, StringKey> = {
	users: 'users',
	projects: 'projects',
	'audio-jobs': 'audio',
	'analysis-jobs': 'analysis',
	providers: 'providers',
	settings: 'settings',
	'feature-flags': 'flags',
	storage: 'storage',
	admins: 'admins',
	audit: 'audit'
};
export default function Page({ searchParams }: { searchParams: { section?: string } }) {
	if (!getAppSettings()('enableDesignPreview')) notFound();
	const section = sections[searchParams.section || ''];
	return (
		<AppShell
			preview
			activePath={searchParams.section && section ? '/' + searchParams.section : '/dashboard'}
		>
			{section ? <Unavailable section={section} preview /> : <Dashboard preview />}
		</AppShell>
	);
}
