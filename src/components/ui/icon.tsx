import type { SVGProps } from 'react';
const paths: Record<string, React.ReactNode> = {
	dashboard: (
		<>
			<rect x="3" y="3" width="7" height="7" rx="1.5" />
			<rect x="14" y="3" width="7" height="7" rx="1.5" />
			<rect x="3" y="14" width="7" height="7" rx="1.5" />
			<rect x="14" y="14" width="7" height="7" rx="1.5" />
		</>
	),
	users: (
		<>
			<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M22 21v-2a4 4 0 0 0-3-3.87" />
			<circle cx="9" cy="7" r="4" />
			<path d="M16 3.13a4 4 0 0 1 0 7.75" />
		</>
	),
	projects: <path d="M3 7a2 2 0 0 1 2-2h5l2 2h7a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z" />,
	audio: <path d="M4 10v4M8 6v12M12 3v18M16 7v10M20 10v4" />,
	analysis: (
		<>
			<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z M14 2v6h6M8 13h8M8 17h5" />
		</>
	),
	providers: (
		<>
			<rect x="4" y="6" width="16" height="15" rx="3" />
			<path d="M12 2v4M8 11h.01M16 11h.01M8 16h8M1 11v5M23 11v5" />
		</>
	),
	settings: (
		<>
			<path d="m12 3 2 3 4-.3.3 4 3 2-3 2-.3 4-4-.3-2 3-2-3-4 .3-.3-4-3-2 3-2 .3-4 4 .3Z" />
			<circle cx="12" cy="12" r="3" />
		</>
	),
	flags: (
		<>
			<path d="M4 22V3c6-4 10 4 16 0v11c-6 4-10-4-16 0" />
		</>
	),
	storage: (
		<>
			<ellipse cx="12" cy="5" rx="8" ry="3" />
			<path d="M4 5v14c0 4 16 4 16 0V5M4 12c0 4 16 4 16 0" />
		</>
	),
	admins: (
		<>
			<path d="m12 2 9 4v6c0 5-9 10-9 10S3 17 3 12V6Z" />
			<path d="m8 12 3 3 5-6" />
		</>
	),
	audit: (
		<>
			<rect x="5" y="3" width="14" height="18" rx="2" />
			<path d="M9 7h6M9 12h6M9 17h4" />
		</>
	),
	search: (
		<>
			<circle cx="10.5" cy="10.5" r="6.5" />
			<path d="m16 16 5 5" />
		</>
	),
	chevron: <path d="m9 5 7 7-7 7" />,
	menu: <path d="M4 6h16M4 12h16M4 18h16" />,
	close: <path d="m6 6 12 12M6 18 18 6" />,
	arrow: <path d="M7 17 17 7M7 7h10v10" />,
	sun: (
		<>
			<circle cx="12" cy="12" r="4" />
			<path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1 1M18 18l1 1M5 19l1-1M18 6l1-1" />
		</>
	),
	moon: <path d="M21 13a9 9 0 0 1-10-10A9 9 0 1 0 21 13Z" />,
	monitor: (
		<>
			<rect x="2" y="3" width="20" height="14" rx="2" />
			<path d="M8 21h8M12 17v4" />
		</>
	),
	logout: (
		<>
			<path d="M9 21H4V3h5M14 7l5 5-5 5M8 12h12" />
		</>
	),
	warning: (
		<>
			<path d="m12 3 10 18H2Z M12 9v4M12 17h.01" />
		</>
	),
	calendar: (
		<>
			<rect x="3" y="5" width="18" height="16" rx="2" />
			<path d="M16 3v4M8 3v4M3 11h18" />
		</>
	),
	eye: (
		<>
			<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Z" />
			<circle cx="12" cy="12" r="3" />
		</>
	),
	check: <path d="m5 12 4 4L19 6" />,
	lock: (
		<>
			<rect x="5" y="10" width="14" height="11" rx="2" />
			<path d="M8 10V6a4 4 0 0 1 8 0v4" />
		</>
	)
};
export function Icon({ name, ...props }: SVGProps<SVGSVGElement> & { name: string }) {
	return (
		<svg
			width="20"
			height="20"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="1.65"
			strokeLinecap="round"
			strokeLinejoin="round"
			aria-hidden="true"
			{...props}
		>
			{paths[name] || paths.dashboard}
		</svg>
	);
}
