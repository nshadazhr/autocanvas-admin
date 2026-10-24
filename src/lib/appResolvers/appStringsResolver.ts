import { localStrings } from '@/src/appDefaults';
export type StringKey = keyof typeof localStrings;
export function getStrings(overrides: Partial<Record<StringKey, string>> = {}) {
	return (key: StringKey): string => (overrides[key]?.trim() ? overrides[key]! : localStrings[key]);
}
