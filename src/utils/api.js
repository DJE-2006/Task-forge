export async function apiFetch(path, options = {}) {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  if (token) headers['Authorization'] = `Bearer ${token}`;

  const base = import.meta.env.VITE_API_URL || (typeof window !== 'undefined' && window.location.hostname === 'localhost' ? 'http://localhost:3000/api' : '/api');
  const url = path.startsWith('/') ? `${base.replace(/\/$/, '')}${path}` : `${base.replace(/\/$/, '')}/${path}`;

  const resp = await fetch(url, {
    ...options,
    headers,
  });

  return resp;
}
