// In-memory user store shared by auth endpoints (development only)
export const users = new Map();

// Demo user to make login immediate for testing
users.set('demo@taskforge.local', {
	id: 'demo-1',
	email: 'demo@taskforge.local',
	password: 'demo123',
	name: 'Demo User',
	created_at: new Date().toISOString(),
});
