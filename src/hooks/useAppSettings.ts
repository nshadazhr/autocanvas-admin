import { getAppSettings } from '@/src/lib/appResolvers';
const appSettings = getAppSettings();
export function useAppSettings() {
	return { appSettings };
}
