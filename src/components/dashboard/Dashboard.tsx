'use client';
import Link from 'next/link';
import { useState } from 'react';
import { Card } from '../ui/card';
import { Icon } from '../ui/icon';
import { useStrings } from '@/src/hooks/useStrings';
import { previewUsers, previewFailures, previewGrowth } from '@/src/lib/dashboard-preview';
import type { StringKey } from '@/src/lib/appResolvers';
export function Dashboard({ preview = false }: { preview?: boolean }) {
	const { lsv } = useStrings();
	const [period, setPeriod] = useState('30');
	const metrics: { label: StringKey; icon: string; color: string; value: string; trend: string }[] = [
		{ label: 'totalUsers', icon: 'users', color: 'blue', value: '12,480', trend: '12' },
		{ label: 'totalProjects', icon: 'analysis', color: 'green', value: '3,245', trend: '8' },
		{ label: 'audioJobs', icon: 'audio', color: 'orange', value: '8,245', trend: '15' },
		{ label: 'failedJobs', icon: 'warning', color: 'red', value: '43', trend: '2' }
	];
	const growth = period === '7' ? previewGrowth.slice(-9) : previewGrowth;
	const points = growth.map((v, i) => `${(i * 620) / (growth.length - 1)},${200 - v}`).join(' ');
	const statuses: { label: StringKey; count: string; percent: string; color: string }[] = [
		{ label: 'completed', count: '7,894', percent: '95.7%', color: 'green' },
		{ label: 'processing', count: '138', percent: '1.7%', color: 'blue' },
		{ label: 'failed', count: '43', percent: '0.5%', color: 'red' },
		{ label: 'pending', count: '170', percent: '2.1%', color: 'amber' }
	];
	const more = (page: string) => (preview ? '/preview?section=' + page : '/' + page);
	return (
		<div className="dashboard-page">
			<div className="page-heading">
				<div>
					<div className="eyebrow">{lsv('overviewLabel')}</div>
					<h1>
						{lsv('dashboard')}
						<span className="heading-dot">.</span>
					</h1>
					<p>{lsv('dashboardDescription')}</p>
				</div>
				<div className="date-chip">
					<Icon name="calendar" />
					{preview
						? lsv('dateRange')
						: new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' }).format(new Date())}
				</div>
			</div>
			{!preview && (
				<div className="notice info">
					<Icon name="admins" />
					{lsv('liveNotice')}
				</div>
			)}
			<div className="metrics-grid">
				{metrics.map((metric) => (
					<Card className="metric-card" key={metric.label}>
						<div className="metric-top">
							<span className={'metric-icon ' + metric.color}>
								<Icon name={metric.icon} width="23" height="23" />
							</span>
							<span className="metric-more">···</span>
						</div>
						<p>{lsv(metric.label)}</p>
						<div className="metric-value">{preview ? metric.value : '—'}</div>
						<div className="metric-bottom">
							{preview ? (
								<>
									<span className={'trend ' + (metric.color === 'red' ? 'negative' : '')}>
										↗ {metric.trend}%
									</span>
									<span>{lsv('lastWeek')}</span>
								</>
							) : (
								<span>{lsv('analyticsPending')}</span>
							)}
						</div>
					</Card>
				))}
			</div>
			<div className="charts-grid">
				<Card className="growth-card">
					<div className="card-heading">
						<div>
							<h2>{lsv('userGrowth')}</h2>
							<p>{lsv('userGrowthDescription')}</p>
						</div>
						{preview && (
							<select
								aria-label={lsv('userGrowth')}
								value={period}
								onChange={(e) => setPeriod(e.target.value)}
							>
								<option value="30">{lsv('last30')}</option>
								<option value="7">{lsv('last7')}</option>
							</select>
						)}
					</div>
					{preview ? (
						<div className="line-chart">
							<div className="chart-y">
								<span>200</span>
								<span>150</span>
								<span>100</span>
								<span>50</span>
								<span>0</span>
							</div>
							<div className="chart-plot">
								<svg
									viewBox="0 0 620 200"
									preserveAspectRatio="none"
									role="img"
									aria-label={lsv('chartLabel')}
								>
									<defs>
										<linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
											<stop offset="0%" stopColor="#4385ff" stopOpacity=".24" />
											<stop offset="100%" stopColor="#4385ff" stopOpacity=".01" />
										</linearGradient>
									</defs>
									{[0, 50, 100, 150, 199].map((y) => (
										<line
											key={y}
											x1="0"
											x2="620"
											y1={y}
											y2={y}
											stroke="var(--border)"
											strokeDasharray="4 4"
										/>
									))}
									<polygon points={`0,200 ${points} 620,200`} fill="url(#areaFill)" />
									<polyline
										points={points}
										fill="none"
										stroke="#4385ff"
										strokeWidth="2.5"
										strokeLinejoin="round"
										vectorEffect="non-scaling-stroke"
									/>
								</svg>
								<div className="chart-x">
									{(period === '7'
										? ['Oct 16', 'Oct 18', 'Oct 20', 'Oct 22']
										: ['Sep 23', 'Sep 28', 'Oct 03', 'Oct 08', 'Oct 13', 'Oct 18', 'Oct 22']
									).map((label) => (
										<span key={label}>{label}</span>
									))}
								</div>
							</div>
						</div>
					) : (
						<div className="chart-empty">
							<Icon name="analysis" />
							{lsv('analyticsPending')}
						</div>
					)}
					<div className="chart-footnote">
						<span className="dot blue" />
						{lsv('totalUsers')}
						{preview && (
							<span className="chart-footnote-value">
								+1,248 <span>↗ 12%</span>
							</span>
						)}
					</div>
				</Card>
				<Card className="distribution-card">
					<div className="card-heading">
						<div>
							<h2>{lsv('distribution')}</h2>
							<p>{lsv('distributionDescription')}</p>
						</div>
						<span className="subtle-icon">
							<Icon name="audio" />
						</span>
					</div>
					<div className="distribution-body">
						<div className={'donut ' + (!preview ? 'donut-empty' : '')}>
							<div>
								<strong>{preview ? '8,245' : '—'}</strong>
								<span>{lsv('totalJobs')}</span>
							</div>
						</div>
						<div className="legend">
							{statuses.map((status) => (
								<div className="legend-row" key={status.label}>
									<span className={'dot ' + status.color} />
									<span>{lsv(status.label)}</span>
									<strong>{preview ? status.count : '—'}</strong>
									<small>{preview ? status.percent : '—'}</small>
								</div>
							))}
						</div>
					</div>
				</Card>
			</div>
			<div className="tables-grid">
				<Card>
					<div className="card-heading">
						<div>
							<h2>{lsv('recentUsers')}</h2>
							<p>{lsv('usersDescription')}</p>
						</div>
						<Link className="text-link" href={more('users')}>
							{lsv('viewAll')}
							<Icon name="chevron" width="14" />
						</Link>
					</div>
					<div className="table-scroll">
						<table className="data-table">
							<thead>
								<tr>
									<th>{lsv('name')}</th>
									<th>{lsv('email')}</th>
									<th>{lsv('status')}</th>
								</tr>
							</thead>
							<tbody>
								{preview ? (
									previewUsers.map((user, index) => (
										<tr key={user.id}>
											<td>
												<span className="person-cell">
													<span className={'avatar avatar-small avatar-' + index}>
														{user.name
															.split(' ')
															.map((n) => n[0])
															.join('')}
													</span>
													<strong>{user.name}</strong>
												</span>
											</td>
											<td className="muted">{user.email}</td>
											<td>
												<span className={'badge ' + (user.email_verified_at ? 'green' : 'neutral')}>
													{lsv(user.email_verified_at ? 'active' : 'inactive')}
												</span>
											</td>
										</tr>
									))
								) : (
									<tr>
										<td colSpan={3} className="empty-cell">
											{lsv('analyticsPending')}
										</td>
									</tr>
								)}
							</tbody>
						</table>
					</div>
				</Card>
				<Card>
					<div className="card-heading">
						<div>
							<h2>{lsv('recentFailed')}</h2>
							<p>{lsv('distributionDescription')}</p>
						</div>
						<Link className="text-link" href={more('audio-jobs')}>
							{lsv('viewAll')}
							<Icon name="chevron" width="14" />
						</Link>
					</div>
					<div className="table-scroll">
						<table className="data-table">
							<thead>
								<tr>
									<th>{lsv('title')}</th>
									<th>{lsv('failedAt')}</th>
									<th>{lsv('status')}</th>
								</tr>
							</thead>
							<tbody>
								{preview ? (
									previewFailures.map((item) => (
										<tr key={item.id}>
											<td>
												<span className="person-cell">
													<span className="job-icon red">
														<Icon name="audio" width="15" />
													</span>
													<strong>
														{lsv('audio')} #{item.id}
													</strong>
												</span>
											</td>
											<td className="muted">{item.date}</td>
											<td>
												<span className="badge red">{lsv('failed')}</span>
											</td>
										</tr>
									))
								) : (
									<tr>
										<td colSpan={3} className="empty-cell">
											{lsv('analyticsPending')}
										</td>
									</tr>
								)}
							</tbody>
						</table>
					</div>
				</Card>
			</div>
		</div>
	);
}
