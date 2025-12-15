export async function apiFetch(path, options = {}) {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  if (token) headers['Authorization'] = `Bearer ${token}`;

  const resp = await fetch(path.startsWith('/') ? path : `/api${path}`, {
    ...options,
    headers,
  });

  return resp;
}
