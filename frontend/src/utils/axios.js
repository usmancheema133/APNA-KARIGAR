import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' }
});

api.interceptors.request.use((config) => {
  const stored = localStorage.getItem('ak_user');
  if (stored) {
    try {
      const user = JSON.parse(stored);
      if (user.token) {
        config.headers.Authorization = `Bearer ${user.token}`;
      }
    } catch {}
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
if (err.response?.status === 401) {
  // Only redirect if user was already logged in, NOT during login attempt
  const stored = localStorage.getItem('ak_user');
  if (stored) {
    localStorage.removeItem('ak_user');
    window.location.href = '/login';
  }
}
    return Promise.reject(err);
  }
);

export default api;
