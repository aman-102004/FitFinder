export const API = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const authHeaders = () => {
  const token = localStorage.getItem('fitfinder_token');
  return { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) };
};

export const getUser  = () => { const u = localStorage.getItem('fitfinder_user'); return u ? JSON.parse(u) : null; };
export const getToken = () => localStorage.getItem('fitfinder_token');
export const clearAuth = () => { localStorage.removeItem('fitfinder_token'); localStorage.removeItem('fitfinder_user'); };
