import type { Config } from 'tailwindcss';

const config: Config = {
	darkMode: 'class',

	content: ['./src/app/**/*.{js,ts,jsx,tsx,mdx}', './src/components/**/*.{js,ts,jsx,tsx,mdx}'],

	theme: {
		extend: {
			colors: {
				background: 'var(--background)',
				foreground: 'var(--foreground)',

				primary: {
					DEFAULT: 'var(--primary)',
					foreground: 'var(--primary-foreground)'
				},

				card: {
					DEFAULT: 'var(--card)',
					foreground: 'var(--card-foreground)'
				},

				muted: {
					DEFAULT: 'var(--muted)',
					foreground: 'var(--muted-foreground)'
				},

				border: 'var(--border)'
			}
		}
	},

	plugins: []
};

export default config;
