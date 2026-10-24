'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import { useAuth } from '@/src/providers/AuthProvider';
import { useStrings } from '@/src/hooks/useStrings';
import { navigation } from './navigation';
import { Brand } from './Brand';
import { Icon } from '../ui/icon';
import ThemeSwitcher from '../ThemeSwitcher';
import { Button } from '../ui/button';
export function AppShell({
	children,
	preview = false,
	activePath
}: {
	children: React.ReactNode;
	preview?: boolean;
	activePath?: string;
}) {
	const { user, initialized, signOut } = useAuth();
	const { lsv } = useStrings();
	const pathname = usePathname();
	const router = useRouter();
	const searchInput = useRef<HTMLInputElement>(null);
	const [open, setOpen] = useState(false);
	const [search, setSearch] = useState('');
	const [busy, setBusy] = useState(false);
	const [error, setError] = useState('');
	useEffect(() => {
		if (!preview && initialized && !user) router.replace('/login');
	}, [preview, initialized, user, router]);
	useEffect(() => {
		setOpen(false);
		setSearch('');
	}, [pathname]);
	useEffect(() => {
		const close = (e: KeyboardEvent) => {
			if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
				e.preventDefault();
				searchInput.current?.focus();
			}
			if (e.key === 'Escape') {
				setOpen(false);
				setSearch('');
			}
		};
		window.addEventListener('keydown', close);
		return () => window.removeEventListener('keydown', close);
	}, []);
	if (!preview && (!initialized || !user))
		return (
			<div className="full-state" role="status">
				<span className="spinner" />
				{lsv('loading')}
			</div>
		);
	const nav = navigation.map((group) => ({
		...group,
		items: group.items.filter((item) => !item.superOnly || preview || user?.role === 'SUPERADMIN')
	}));
	const matches = nav
		.flatMap((group) => group.items)
		.filter((item) => lsv(item.key).toLowerCase().includes(search.toLowerCase()));
	async function leave() {
		setBusy(true);
		setError('');
		try {
			await signOut();
			router.replace('/login');
		} catch (e) {
			setError(e instanceof Error ? e.message : lsv('error'));
		} finally {
			setBusy(false);
		}
	}
	const link = (href: string) =>
		preview ? '/preview' + (href === '/dashboard' ? '' : '?section=' + href.slice(1)) : href;
	return (
		<div className="app-shell">
			<a className="skip-link" href="#main">
				{lsv('overviewLabel')}
			</a>
			{open && <button className="sidebar-scrim" aria-label={lsv('close')} onClick={() => setOpen(false)} />}
			<aside className={'sidebar ' + (open ? 'is-open' : '')}>
				<div className="sidebar-brand">
					<Link href={link('/dashboard')}>
						<Brand />
					</Link>
					<button
						className="icon-button mobile-close"
						aria-label={lsv('close')}
						onClick={() => setOpen(false)}
					>
						<Icon name="close" />
					</button>
				</div>
				<nav aria-label={lsv('workspace')}>
					{nav.map((group) => (
						<div className="nav-group" key={group.group}>
							{group.group !== 'overview' && <p className="nav-caption">{lsv(group.group)}</p>}
							{group.items.map((item) => (
								<Link
									key={item.key}
									className={'nav-item ' + ((activePath || pathname) === item.href ? 'selected' : '')}
									href={link(item.href)}
								>
									<Icon name={item.key} />
									<span>{lsv(item.key)}</span>
									{item.key === 'dashboard' && <span className="nav-dot" />}
								</Link>
							))}
						</div>
					))}
				</nav>
				<div className="sidebar-bottom">
					<span className="workspace-dot" />
					<span>{lsv('workspaceHint')}</span>
					<small>v1.0</small>
				</div>
			</aside>
			<div className="workspace">
				<header className="topbar">
					<div className="topbar-left">
						<button
							className="icon-button mobile-menu"
							aria-label={lsv('menu')}
							aria-expanded={open}
							onClick={() => setOpen(!open)}
						>
							<Icon name="menu" />
						</button>
						<span className="desktop-breadcrumb">
							{lsv('workspace')}
							<span>/</span>
							<strong>
								{lsv(navigation.flatMap((g) => g.items).find((i) => i.href === pathname)?.key || 'dashboard')}
							</strong>
						</span>
					</div>
					<div className="topbar-actions">
						<div className="global-search">
							<Icon name="search" />
							<input
								ref={searchInput}
								aria-label={lsv('search')}
								placeholder={lsv('search')}
								value={search}
								onChange={(e) => setSearch(e.target.value)}
							/>
							<kbd>⌘ K</kbd>
							{search && (
								<div className="search-results">
									{matches.length ? (
										matches.map((item) => (
											<Link key={item.key} href={link(item.href)} onClick={() => setSearch('')}>
												<Icon name={item.key} />
												{lsv(item.key)}
												<Icon name="chevron" />
											</Link>
										))
									) : (
										<p>{lsv('pageSearchEmpty')}</p>
									)}
								</div>
							)}
						</div>
						<ThemeSwitcher />
						<span className="topbar-divider" />
						<div className="profile">
							<span className="avatar">
								{(preview ? lsv('previewUser') : user?.name || user?.email || 'A').slice(0, 1).toUpperCase()}
							</span>
							<span className="profile-copy">
								<strong>{preview ? lsv('previewUser') : user?.name || user?.email}</strong>
								<small>{lsv(preview || user?.role === 'SUPERADMIN' ? 'superadmin' : 'admin')}</small>
							</span>
						</div>
						{!preview && (
							<button
								className="icon-button"
								onClick={leave}
								disabled={busy}
								aria-label={lsv(busy ? 'signingOut' : 'logout')}
								title={lsv('logout')}
							>
								<Icon name="logout" />
							</button>
						)}
					</div>
				</header>
				{preview && (
					<div className="preview-banner">
						<span>
							<Icon name="eye" />
							<strong>{lsv('previewMode')}</strong>
							<span>{lsv('previewNotice')}</span>
						</span>
						<Link href="/login">
							{lsv('exitPreview')}
							<Icon name="arrow" />
						</Link>
					</div>
				)}
				{error && (
					<div className="notice error" role="alert">
						{error}
					</div>
				)}
				<main id="main" className="main-content">
					{children}
				</main>
				<footer className="app-footer">
					<span>
						© {new Date().getFullYear()} {lsv('brand')}
					</span>
					<span>{lsv('footer')}</span>
				</footer>
			</div>
		</div>
	);
}
