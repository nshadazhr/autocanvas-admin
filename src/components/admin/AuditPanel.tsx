'use client';
import { useEffect, useRef, useState } from 'react';
import { useAuth } from '@/src/providers/AuthProvider';
import { useStrings } from '@/src/hooks/useStrings';
import { useAppSettings } from '@/src/hooks/useAppSettings';
import { listAudit } from '@/src/app/api/admin/admin.api';
import type { AuditEvent } from '@/src/app/api/auth/auth.types';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
export function AuditPanel() {
	const { user } = useAuth();
	const { lsv } = useStrings();
	const { appSettings } = useAppSettings();
	const [rows, setRows] = useState<AuditEvent[]>([]);
	const [cursor, setCursor] = useState<number | null>(null);
	const [busy, setBusy] = useState(false);
	const [error, setError] = useState('');
	const epoch = useRef(0);
	const abort = useRef<AbortController | null>(null);
	async function load(next?: number) {
		abort.current?.abort();
		const control = new AbortController();
		abort.current = control;
		const request = ++epoch.current;
		setBusy(true);
		setError('');
		try {
			const result = await listAudit(appSettings('pageSize'), next, control.signal);
			if (request === epoch.current) {
				setRows((old) => (next ? [...old, ...result.events] : result.events));
				setCursor(result.nextCursor);
			}
		} catch (e) {
			if (!control.signal.aborted && request === epoch.current)
				setError(e instanceof Error ? e.message : lsv('error'));
		} finally {
			if (request === epoch.current) setBusy(false);
		}
	}
	useEffect(() => {
		if (user?.role === 'SUPERADMIN') void load();
		return () => {
			abort.current?.abort();
			epoch.current++;
		};
	}, [user?.role]);
	if (user?.role !== 'SUPERADMIN')
		return (
			<div className="notice error" role="alert">
				{lsv('forbidden')}
			</div>
		);
	return (
		<>
			<div className="page-heading">
				<div>
					<div className="eyebrow">{lsv('security')}</div>
					<h1>
						{lsv('audit')}
						<span className="heading-dot">.</span>
					</h1>
					<p>{lsv('auditDescription')}</p>
				</div>
				<Button variant="secondary" disabled={busy} onClick={() => void load()}>
					{lsv('refresh')}
				</Button>
			</div>
			{error && (
				<div className="notice error" role="alert">
					{error}
					<Button variant="ghost" onClick={() => void load()}>
						{lsv('retry')}
					</Button>
				</div>
			)}
			<Card>
				<div className="table-scroll">
					<table className="data-table audit-table">
						<thead>
							<tr>
								{(['actor', 'target', 'previousRole', 'newRole', 'reason', 'when'] as const).map((key) => (
									<th key={key}>{lsv(key)}</th>
								))}
							</tr>
						</thead>
						<tbody>
							{rows.map((event) => (
								<tr key={event.id}>
									<td>{event.actorEmail || lsv('bootstrap')}</td>
									<td>{event.targetEmail}</td>
									<td>{event.fromRole}</td>
									<td>
										<span className="badge blue">{event.toRole}</span>
									</td>
									<td className="audit-reason">{event.reason}</td>
									<td className="muted">{new Date(event.createdAt).toLocaleString()}</td>
								</tr>
							))}
							{!rows.length && (
								<tr>
									<td colSpan={6} className="empty-cell">
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
		</>
	);
}
