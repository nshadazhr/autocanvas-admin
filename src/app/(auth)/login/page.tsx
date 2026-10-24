'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/src/providers/AuthProvider';
import { useStrings } from '@/src/hooks/useStrings';
import { useAppSettings } from '@/src/hooks/useAppSettings';
import { Brand } from '@/src/components/layout/Brand';
import ThemeSwitcher from '@/src/components/ThemeSwitcher';
import { Icon } from '@/src/components/ui/icon';
import { Input } from '@/src/components/ui/input';
import { Button } from '@/src/components/ui/button';
import { ApiError } from '@/src/app/api/client';
export default function LoginPage() {
	const { user, signIn, initialized } = useAuth();
	const { lsv } = useStrings();
	const { appSettings } = useAppSettings();
	const router = useRouter();
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [show, setShow] = useState(false);
	const [busy, setBusy] = useState(false);
	const [error, setError] = useState('');
	const [wait, setWait] = useState(0);
	useEffect(() => {
		if (initialized && user) router.replace('/dashboard');
	}, [initialized, user, router]);
	useEffect(() => {
		if (!wait) return;
		const timer = setTimeout(() => setWait(wait - 1), 1000);
		return () => clearTimeout(timer);
	}, [wait]);
	async function submit(e: React.FormEvent) {
		e.preventDefault();
		if (busy || wait) return;
		setBusy(true);
		setError('');
		try {
			await signIn(email.trim(), password);
			router.replace('/dashboard');
		} catch (err) {
			setError(
				err instanceof ApiError && err.status === 429
					? lsv('rateLimit')
					: err instanceof Error
						? err.message
						: lsv('error')
			);
			if (err instanceof ApiError && err.status === 429) setWait(err.retryAfter || 60);
		} finally {
			setBusy(false);
		}
	}
	return (
		<main className="login-page">
			<section className="login-art">
				<Brand />
				<div className="login-art-content">
					<span className="eyebrow">{lsv('loginBadge')}</span>
					<h1>{lsv('loginHero')}</h1>
					<p>{lsv('loginDescription')}</p>
					<div className="abstract-art" aria-hidden="true">
						<div className="art-orbit orbit-one" />
						<div className="art-orbit orbit-two" />
						<div className="art-core">
							A<span>✦</span>
						</div>
						<div className="art-label label-one">
							<Icon name="admins" />
							{lsv('loginFeatureOne')}
						</div>
						<div className="art-label label-two">
							<Icon name="dashboard" />
							{lsv('loginFeatureTwo')}
						</div>
					</div>
				</div>
				<small>{lsv('workspaceHint')}</small>
			</section>
			<section className="login-form-side">
				<div className="login-theme">
					<ThemeSwitcher />
				</div>
				<div className="login-form">
					<span className="login-lock">
						<Icon name="lock" width="25" height="25" />
					</span>
					<h2>{lsv('loginTitle')}</h2>
					<p>{lsv('loginSubtitle')}</p>
					<form onSubmit={submit}>
						<label htmlFor="email">{lsv('email')}</label>
						<Input
							id="email"
							type="email"
							autoComplete="username"
							placeholder={lsv('emailPlaceholder')}
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							required
							maxLength={254}
						/>
						<label htmlFor="password">{lsv('password')}</label>
						<div className="password-field">
							<Input
								id="password"
								type={show ? 'text' : 'password'}
								autoComplete="current-password"
								placeholder={lsv('passwordPlaceholder')}
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								required
							/>
							<button
								type="button"
								className="icon-button"
								aria-label={lsv(show ? 'hidePassword' : 'showPassword')}
								aria-pressed={show}
								onClick={() => setShow(!show)}
							>
								<Icon name="eye" />
							</button>
						</div>
						{error && (
							<div role="alert" className="notice error">
								{error}
								{wait > 0 && ` (${wait}s)`}
							</div>
						)}
						<Button className="login-submit" disabled={busy || wait > 0 || !initialized}>
							{busy ? <span className="spinner" /> : null}
							{lsv(busy ? 'signingIn' : 'login')}
							<Icon name="arrow" />
						</Button>
					</form>
					<div className="login-restricted">
						<Icon name="admins" />
						{lsv('loginFootnote')}
					</div>
					{appSettings('enableDesignPreview') && (
						<Link className="preview-link" href="/preview">
							{lsv('preview')}
							<Icon name="arrow" />
						</Link>
					)}
				</div>
				<small className="login-bottom">
					© {new Date().getFullYear()} {lsv('brand')} · {lsv('footer')}
				</small>
			</section>
		</main>
	);
}
