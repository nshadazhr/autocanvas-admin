import { getStrings } from '@/src/lib/appResolvers';
const lsv = getStrings();
export function useStrings() {
	return { lsv };
}
