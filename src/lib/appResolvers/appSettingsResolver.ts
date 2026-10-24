import { localAppSettings } from '@/src/appDefaults';
export function getAppSettings(
	overrides: Partial<{ [K in keyof typeof localAppSettings]: string | number | boolean }> = {}
) {
	return <K extends keyof typeof localAppSettings>(key: K): (typeof localAppSettings)[K] => {
		const value = overrides[key];
		return (
			typeof value === typeof localAppSettings[key] ? value : localAppSettings[key]
		) as (typeof localAppSettings)[K];
	};
}
