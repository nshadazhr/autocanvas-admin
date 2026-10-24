let token: string | null = null;
let epoch = 0;
export const getAccessToken = () => token;
export const getAuthEpoch = () => epoch;
export const setAccessToken = (value: string) => {
	token = value;
};
export const clearAccessToken = () => {
	token = null;
	epoch++;
};
