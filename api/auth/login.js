// Simple in-memory user storage (replace with database in production)
const users = new Map();

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { email, password, name } = req.body;

  if (!email || !password) {
    res.status(400).json({ error: 'Email and password are required' });
    return;
  }

  if (req.method === 'POST') {
    // Check if user exists
    const user = users.get(email);

    if (user && user.password === password) {
      // Login successful
      res.status(200).json({
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
        token: `token_${user.id}`, // Simple token (use JWT in production)
      });
      return;
    }

    if (user) {
      res.status(401).json({ error: 'Invalid password' });
      return;
    }

    // User doesn't exist, create new account
    if (!name) {
      res.status(400).json({ error: 'Name is required for registration' });
      return;
    }

    const newUser = {
      id: Date.now().toString(),
      email,
      password, // Never store plaintext passwords in production!
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
}
