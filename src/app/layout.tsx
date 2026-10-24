import type { Metadata } from 'next';
import ThemeProvider from '@/src/providers/ThemeProvider';
import AuthProvider from '@/src/providers/AuthProvider';
import './globals.css';
export const metadata: Metadata = {
	title: { default: 'AutoCanvas Admin', template: '%s · AutoCanvas Admin' },
	description: 'AutoCanvas Administration Panel'
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body>
				<ThemeProvider>
					<AuthProvider>{children}</AuthProvider>
				</ThemeProvider>
			</body>
		</html>
	);
}
