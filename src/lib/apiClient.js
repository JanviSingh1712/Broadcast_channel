const BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';
const delay = ms => new Promise(r => setTimeout(r, ms));

const getToken = () =>
  typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;

const headers = (extra = {}) => ({
  'Content-Type': 'application/json',
  ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
  ...extra,
});

export const apiClient = {
  get: async (path, params = {}) => {
    const url = new URL(`${BASE_URL}${path}`, window.location.origin);
    Object.entries(params).forEach(([k, v]) => v !== undefined && url.searchParams.set(k, v));
    const res = await fetch(url.toString(), { headers: headers() });
    if (!res.ok) throw new Error(`GET ${path} → ${res.status}`);
    return res.json();
  },
  post: async (path, body) => {
    const res = await fetch(`${BASE_URL}${path}`, { method: 'POST', headers: headers(), body: JSON.stringify(body) });
    if (!res.ok) throw new Error(`POST ${path} → ${res.status}`);
    return res.json();
  },
  patch: async (path, body) => {
    const res = await fetch(`${BASE_URL}${path}`, { method: 'PATCH', headers: headers(), body: JSON.stringify(body) });
    if (!res.ok) throw new Error(`PATCH ${path} → ${res.status}`);
    return res.json();
  },
};

// Simulates realistic network latency in mock mode
export const simulateDelay = () => delay(350 + Math.random() * 350);
