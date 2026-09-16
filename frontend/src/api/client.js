const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000';
let accessToken = null;
export const authStore = { get: () => accessToken, set: (token) => { accessToken = token; } };
async function request(path, options = {}, retry = true) {
  const response = await fetch(`${baseUrl}${path}`, { ...options, credentials: 'include', headers: { 'Content-Type': 'application/json', ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}), ...options.headers } });
  if (response.status === 401 && retry && path !== '/api/auth/refresh') { const refresh = await fetch(`${baseUrl}/api/auth/refresh`, { method: 'POST', credentials: 'include' }); if (refresh.ok) { const json = await refresh.json(); authStore.set(json.data.accessToken); return request(path, options, false); } }
  if (response.status === 204) return null; const json = await response.json().catch(() => ({})); if (!response.ok) throw new Error(json.error?.message || 'Request failed'); return json.data;
}
export const api = { get: (path) => request(path), post: (path, body) => request(path, { method: 'POST', body: JSON.stringify(body) }), patch: (path, body) => request(path, { method: 'PATCH', body: JSON.stringify(body) }), delete: (path) => request(path, { method: 'DELETE' }) };
