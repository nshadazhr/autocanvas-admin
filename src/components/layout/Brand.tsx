import { getStrings } from '@/src/lib/appResolvers';
const s = getStrings();
export function Brand() {
	return (
		<div className="brand">
			<span className="brand-mark">
				<svg width="29" height="31" viewBox="0 0 29 31" fill="none" aria-hidden="true">
					<path d="M3 5a3 3 0 0 1 4-3l19 11a3 3 0 0 1 0 5L7 29a3 3 0 0 1-4-3Z" fill="url(#brandGradient)" />
					<path d="m10 10 11 6-11 6Z" fill="white" />
					<defs>
						<linearGradient id="brandGradient" x1="0" x2="30" y1="0" y2="30" gradientUnits="userSpaceOnUse">
							<stop stopColor="#9764ff" />
							<stop offset=".55" stopColor="#5957ff" />
							<stop offset="1" stopColor="#26cfec" />
						</linearGradient>
					</defs>
				</svg>
			</span>
			<span>
				<strong>{s('brand')}</strong>
				<small>{s('adminPanel')}</small>
			</span>
		</div>
	);
}
