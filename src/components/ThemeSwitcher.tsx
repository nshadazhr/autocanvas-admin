'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';

export default function ThemeSwitcher() {
	const { theme, setTheme } = useTheme();
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) return null;

	return (
		<select
			value={theme}
			onChange={e => setTheme(e.target.value)}
			className='rounded-lg border border-border bg-card px-3 py-2 text-card-foreground'
			aria-label='Select theme'
		>
			<option value='light'>Light</option>
			<option value='dark'>Dark</option>
			<option value='system'>System</option>
		</select>
	);
}
