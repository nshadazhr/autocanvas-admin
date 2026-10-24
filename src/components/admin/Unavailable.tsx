'use client';
import Link from 'next/link';
import { Icon } from '../ui/icon';
import { Card } from '../ui/card';
import { useStrings } from '@/src/hooks/useStrings';
import type { StringKey } from '@/src/lib/appResolvers';
export function Unavailable({ section, preview = false }: { section: StringKey; preview?: boolean }) {
	const { lsv } = useStrings();
	return (
		<>
			<div className="page-heading">
				<div>
					<div className="eyebrow">{lsv('workspace')}</div>
					<h1>{lsv(section)}</h1>
				</div>
			</div>
			<Card className="unavailable">
				<span className="empty-icon">
					<Icon name={section} width="30" height="30" />
				</span>
				<h2>{lsv('unavailable')}</h2>
				<p>{lsv('unavailableDescription')}</p>
				<Link className="button button-primary" href={preview ? '/preview' : '/dashboard'}>
					{lsv('backDashboard')}
					<Icon name="arrow" />
				</Link>
			</Card>
		</>
	);
}
