import { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('ak_user');
    if (stored) {
      try { setUser(JSON.parse(stored)); }
      catch { localStorage.removeItem('ak_user'); }
    }
    setLoading(false);
  }, []);

  // identifier = phone number OR email
  const login = async (identifier, password) => {
    const res = await api.post('/auth/login', { identifier, password });
    const userData = res.data;
    setUser(userData);
    localStorage.setItem('ak_user', JSON.stringify(userData));
    return userData;
  };

  const register = async (data) => {
    // Use FormData so CNIC photo files are sent correctly
    const formData = new FormData();
    Object.keys(data).forEach(key => {
      if (data[key] !== null && data[key] !== undefined && data[key] !== '') {
        formData.append(key, data[key]);
      }
    });
    const res = await api.post('/auth/register', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    const userData = res.data;
    setUser(userData);
    localStorage.setItem('ak_user', JSON.stringify(userData));
    return userData;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('ak_user');
  };

  const updateUser = (data) => {
    const updated = { ...user, ...data };
    setUser(updated);
    localStorage.setItem('ak_user', JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
