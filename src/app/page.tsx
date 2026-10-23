import ThemeSwitcher from '@/src/components/ThemeSwitcher';

export default function HomePage() {
	return (
		<main className='min-h-screen bg-background p-8 text-foreground'>
			<div className='rounded-xl border border-border bg-card p-6'>
				<h1 className='mb-4 text-2xl font-bold'>AutoCanvas Admin</h1>

				<ThemeSwitcher />
			</div>
		</main>
	);
}
