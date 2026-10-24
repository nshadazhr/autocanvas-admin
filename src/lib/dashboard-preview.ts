// Design fixtures only. Never substitute these for authenticated platform data.
export const previewUsers = [
	{ id: 1, name: 'Rahul Sharma', email: 'rahul@example.com', role: 'USER', email_verified_at: '2026-10-01' },
	{
		id: 2,
		name: 'Anjali Patel',
		email: 'anjali@example.com',
		role: 'ADMIN',
		email_verified_at: '2026-10-01'
	},
	{ id: 3, name: 'Vikram Kumar', email: 'vikram@example.com', role: 'USER', email_verified_at: '2026-10-01' },
	{ id: 4, name: 'Sneha Priya', email: 'sneha@example.com', role: 'USER', email_verified_at: null },
	{ id: 5, name: 'Amit Kumar', email: 'amit@example.com', role: 'USER', email_verified_at: '2026-10-01' }
] as const;
export const previewFailures = [
	{ id: 128, date: 'Oct 22, 2026' },
	{ id: 126, date: 'Oct 22, 2026' },
	{ id: 124, date: 'Oct 21, 2026' },
	{ id: 122, date: 'Oct 21, 2026' },
	{ id: 121, date: 'Oct 20, 2026' }
];
export const previewGrowth = [
	28, 35, 39, 47, 43, 57, 54, 73, 68, 90, 74, 63, 78, 99, 90, 93, 86, 89, 81, 93, 115, 107, 127, 119, 145,
	159, 143, 138, 161, 174, 183, 169, 158, 162, 167, 157, 147, 139
];
