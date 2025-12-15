// Simple in-memory user storage (replace with database in production)
import { users } from './store.js';

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Content-Type, X-Requested-With'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { email, password } = req.body || {};

  if (!email || !password) {
    res.status(400).json({ error: 'Email and password are required' });
    return;
  }

  const user = users.get(email);

  if (!user) {
    res.status(401).json({ error: 'User not found' });
    return;
  }

  if (user.password !== password) {
    res.status(401).json({ error: 'Invalid password' });
    return;
  }

  res.status(200).json({
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
    },
    token: `token_${user.id}`,
  });
}
