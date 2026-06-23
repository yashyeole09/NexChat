import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api`
  : '/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT - read from both localStorage and Zustand persist
api.interceptors.request.use((config) => {
  // Try direct localStorage first
  let token = localStorage.getItem('accessToken');

  // If not found, try Zustand persisted state
  if (!token) {
    try {
      const zustandState = localStorage.getItem('nexchat-auth');
      if (zustandState) {
        const parsed = JSON.parse(zustandState);
        token = parsed?.state?.accessToken || null;
      }
    } catch {}
  }

  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

// Auto-refresh token on 401
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      try {
        let refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
          const zustandState = localStorage.getItem('nexchat-auth');
          if (zustandState) {
            const parsed = JSON.parse(zustandState);
            refreshToken = parsed?.state?.refreshToken || null;
          }
        }
        if (!refreshToken) throw new Error('No refresh token');
        const { data } = await axios.post(`${API_BASE}/auth/refresh`, { refreshToken });
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);
        original.headers['Authorization'] = `Bearer ${data.accessToken}`;
        return api(original);
      } catch {
        localStorage.clear();
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;