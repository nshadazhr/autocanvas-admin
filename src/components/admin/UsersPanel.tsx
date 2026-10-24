'use client';
import { useEffect, useRef, useState } from 'react';
import { useAuth } from '@/src/providers/AuthProvider';
import { useStrings } from '@/src/hooks/useStrings';
import { useAppSettings } from '@/src/hooks/useAppSettings';
import { listUsers, changeRole } from '@/src/app/api/admin/admin.api';
import type { AdminUser, Role } from '@/src/app/api/auth/auth.types';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Icon } from '../ui/icon';
export function UsersPanel({ admins = false }: { admins?: boolean }) {
	const { user: actor, signOut } = useAuth();
	const { lsv } = useStrings();
	const { appSettings } = useAppSettings();
	const [rows, setRows] = useState<AdminUser[]>([]);
	const [cursor, setCursor] = useState<number | null>(null);
	const [search, setSearch] = useState('');
	const [query, setQuery] = useState({ search: '', role: admins ? 'ADMIN' : '' });
	const [busy, setBusy] = useState(false);
	const [error, setError] = useState('');
	const [notice, setNotice] = useState('');
	const [version, setVersion] = useState(0);
	const [target, setTarget] = useState<AdminUser | null>(null);
	const [role, setRole] = useState<Role>('USER');
	const [reason, setReason] = useState('');
	const [saving, setSaving] = useState(false);
	const [saveError, setSaveError] = useState('');
	const epoch = useRef(0);
	const cancelRef = useRef<AbortController | null>(null);
	const savingRef = useRef(false);
	const dialog = useRef<HTMLDialogElement>(null);
	async function load(next?: number) {
		cancelRef.current?.abort();
		const control = new AbortController();
		cancelRef.current = control;
		const request = ++epoch.current;
		setBusy(true);
		setError('');
		try {
			const result = await listUsers(
				{ ...query, cursor: next, limit: appSettings('pageSize') },
				control.signal
			);
			if (request !== epoch.current) return;
			setRows((old) => (next ? [...old, ...result.users] : result.users));
			setCursor(result.nextCursor);
		} catch (e) {
			if (!control.signal.aborted && request === epoch.current)
				setError(e instanceof Error ? e.message : lsv('error'));
		} finally {
			if (request === epoch.current) setBusy(false);
		}
	}
	useEffect(() => {
		if (actor?.role !== 'SUPERADMIN') return;
		setRows([]);
		setCursor(null);
		void load();
		return () => {
			cancelRef.current?.abort();
			epoch.current++;
		};
	}, [query, version, actor?.role]);
	useEffect(() => {
		if (target) dialog.current?.showModal();
		else dialog.current?.close();
	}, [target]);
	if (actor?.role !== 'SUPERADMIN')
		return (
			<div className="notice error" role="alert">
				{lsv('forbidden')}
			</div>
		);
	async function save(e: React.FormEvent) {
		e.preventDefault();
		if (!target || savingRef.current) return;
		savingRef.current = true;
		setSaving(true);
		setSaveError('');
		try {
			const result = await changeRole(target.id, role, reason.trim());
			setNotice(lsv(result.changed ? 'saved' : 'unchanged'));
			setTarget(null);
			if (result.changed && target.id === actor?.id) {
				await signOut();
				return;
			}
			setVersion((v) => v + 1);
		} catch (e) {
			setSaveError(e instanceof Error ? e.message : lsv('error'));
		} finally {
			savingRef.current = false;
			setSaving(false);
		}
	}
	return (
		<>
			<div className="page-heading">
				<div>
					<div className="eyebrow">{lsv(admins ? 'security' : 'management')}</div>
					<h1>
						{lsv(admins ? 'admins' : 'users')}
						<span className="heading-dot">.</span>
					</h1>
					<p>{lsv(admins ? 'adminsDescription' : 'usersDescription')}</p>
				</div>
				<Button variant="secondary" disabled={busy} onClick={() => setVersion((v) => v + 1)}>
					{lsv('refresh')}
				</Button>
			</div>
			{notice && (
				<div className="notice success" role="status">
					{notice}
				</div>
			)}
			<Card>
				<form
					className="filter-bar"
					onSubmit={(e) => {
						e.preventDefault();
						setQuery((q) => ({ ...q, search }));
					}}
				>
					<div className="filter-search">
						<Icon name="search" />
						<Input
							aria-label={lsv('searchUsers')}
							placeholder={lsv('searchUsers')}
							value={search}
							onChange={(e) => setSearch(e.target.value)}
							maxLength={200}
						/>
					</div>
					<select
						aria-label={lsv('role')}
						value={query.role}
						onChange={(e) => setQuery((q) => ({ ...q, role: e.target.value }))}
					>
						{!admins && <option value="">{lsv('allRoles')}</option>}
						{!admins && <option value="USER">{lsv('member')}</option>}
						<option value="ADMIN">{lsv('admin')}</option>
						<option value="SUPERADMIN">{lsv('superadmin')}</option>
					</select>
					<Button type="submit" disabled={busy}>
						{lsv('searchButton')}
					</Button>
				</form>
				{error && (
					<div className="notice error" role="alert">
						{error}
						<Button variant="ghost" onClick={() => void load()}>
							{lsv('retry')}
						</Button>
					</div>
				)}
				<div className="table-scroll">
					<table className="data-table users-table">
						<thead>
							<tr>
								<th>{lsv('name')}</th>
								<th>{lsv('email')}</th>
								<th>{lsv('role')}</th>
								<th>{lsv('status')}</th>
								<th>{lsv('actions')}</th>
							</tr>
						</thead>
						<tbody>
							{rows.map((person) => (
								<tr key={person.id}>
									<td>
										<span className="person-cell">
											<span className="avatar avatar-small">
												{(person.name || person.email).slice(0, 1).toUpperCase()}
											</span>
											<strong>{person.name || lsv('noName')}</strong>
										</span>
									</td>
									<td className="muted">{person.email}</td>
									<td>
										<span className="badge blue">
											{lsv(
												person.role === 'SUPERADMIN'
													? 'superadmin'
													: person.role === 'ADMIN'
														? 'admin'
														: 'member'
											)}
										</span>
									</td>
									<td>
										<span className={'badge ' + (person.email_verified_at ? 'green' : 'neutral')}>
											{lsv(person.email_verified_at ? 'active' : 'inactive')}
										</span>
									</td>
									<td>
										<Button
											variant="secondary"
											onClick={() => {
												setTarget(person);
												setRole(person.role);
												setReason('');
												setSaveError('');
											}}
										>
											{lsv('changeRole')}
										</Button>
									</td>
								</tr>
							))}
							{!rows.length && (
								<tr>
									<td className="empty-cell" colSpan={5}>
										{lsv(busy ? 'loadingData' : 'noResults')}
									</td>
								</tr>
							)}
						</tbody>
					</table>
				</div>
				{cursor && (
					<div className="table-pagination">
						<Button variant="secondary" disabled={busy} onClick={() => void load(cursor)}>
							{lsv(busy ? 'loadingData' : 'loadMore')}
						</Button>
					</div>
				)}
			</Card>
			<dialog
				ref={dialog}
				className="role-dialog"
				onCancel={(e) => {
					if (saving) e.preventDefault();
					else setTarget(null);
				}}
				onClose={() => {
					if (!saving) setTarget(null);
				}}
			>
				<form onSubmit={save}>
					<div className="dialog-heading">
						<span className="metric-icon blue">
							<Icon name="admins" />
						</span>
						<h2>{lsv('changeRole')}</h2>
						<button
							type="button"
							className="icon-button"
							aria-label={lsv('cancel')}
							disabled={saving}
							onClick={() => setTarget(null)}
						>
							<Icon name="close" />
						</button>
					</div>
					<p>{target?.email}</p>
					<label htmlFor="new-role">{lsv('role')}</label>
					<select
						id="new-role"
						value={role}
						disabled={saving}
						onChange={(e) => setRole(e.target.value as Role)}
					>
						<option value="USER">{lsv('member')}</option>
						<option value="ADMIN">{lsv('admin')}</option>
						<option value="SUPERADMIN">{lsv('superadmin')}</option>
					</select>
					<label htmlFor="role-reason">{lsv('reason')}</label>
					<textarea
						id="role-reason"
						value={reason}
						onChange={(e) => setReason(e.target.value)}
						placeholder={lsv('reasonPlaceholder')}
						required
						minLength={5}
						maxLength={500}
						disabled={saving}
					/>
					<small>{lsv('reasonHint')}</small>
					<div className="notice info">{lsv('roleWarning')}</div>
					{saveError && (
						<div className="notice error" role="alert">
							{saveError}
						</div>
					)}
					<div className="dialog-actions">
						<Button type="button" variant="secondary" disabled={saving} onClick={() => setTarget(null)}>
							{lsv('cancel')}
						</Button>
						<Button disabled={saving || reason.trim().length < 5}>
							{lsv(saving ? 'saving' : 'saveRole')}
						</Button>
					</div>
				</form>
			</dialog>
		</>
	);
}
