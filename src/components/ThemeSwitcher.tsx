'use client';
import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { useStrings } from '@/src/hooks/useStrings';
import { Icon } from './ui/icon';
export default function ThemeSwitcher() {
	const { theme, setTheme } = useTheme();
	const [mounted, setMounted] = useState(false);
	const { lsv } = useStrings();
	useEffect(() => setMounted(true), []);
	return (
		<div className="theme-switch">
			<Icon name={mounted && theme === 'dark' ? 'moon' : mounted && theme === 'light' ? 'sun' : 'monitor'} />
			<select
				aria-label={lsv('theme')}
				value={mounted ? theme : 'system'}
				onChange={(e) => setTheme(e.target.value)}
				disabled={!mounted}
			>
				<option value="light">{lsv('light')}</option>
				<option value="dark">{lsv('dark')}</option>
				<option value="system">{lsv('systemTheme')}</option>
			</select>
		</div>
	);
}
