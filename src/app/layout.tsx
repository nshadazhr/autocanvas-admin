import type { Metadata } from 'next';
import ThemeProvider from '@/src/provider/ThemeProvider';
import type './globals.css';

export const metadata: Metadata = {
	title: 'AutoCanvas Admin',
	description: 'AutoCanvas Administration Panel'
};

export default function RootLayout({
	children
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang='en' suppressHydrationWarning>
			<body>
				<ThemeProvider>{children}</ThemeProvider>
			</body>
		</html>
	);
}
