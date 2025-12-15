import { users } from './store.js';

export default function handler(req, res) {
	res.setHeader('Access-Control-Allow-Credentials', 'true');
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
	res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Requested-With');

	if (req.method === 'OPTIONS') {
		res.status(200).end();
		return;
	}

	if (req.method !== 'POST') {
		res.status(405).json({ error: 'Method not allowed' });
		return;
	}

	const { email, password, name } = req.body || {};

	if (!email || !password || !name) {
		res.status(400).json({ error: 'Name, email and password are required' });
		return;
	}

	if (users.has(email)) {
		res.status(409).json({ error: 'User already exists' });
		return;
	}

	const newUser = {
		id: Date.now().toString(),
		email,
		password, // plaintext for demo only — hash in production
		name,
		created_at: new Date().toISOString(),
	};

	users.set(email, newUser);

	res.status(201).json({
		user: {
			id: newUser.id,
			email: newUser.email,
			name: newUser.name,
		},
		token: `token_${newUser.id}`,
	});
}
