import React, { createContext, useContext, useState } from 'react';
import { getUser, getToken, clearAuth } from '../utils/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user,  setUser]  = useState(getUser);
  const [token, setToken] = useState(getToken);

  const login = (userData, tokenData) => {
    localStorage.setItem('fitfinder_token', tokenData);
    localStorage.setItem('fitfinder_user', JSON.stringify(userData));
    setUser(userData);
    setToken(tokenData);
  };

  const logout = () => { clearAuth(); setUser(null); setToken(null); };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isLoggedIn: !!token }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
