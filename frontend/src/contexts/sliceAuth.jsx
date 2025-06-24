import React, { createContext, useContext, useState, useEffect } from 'react';

const sliceAuth = createContext();

export function AuthProvider({ children }) {
  const [isAutenticado, setIsAutenticado] = useState(!!localStorage.getItem('token'));

  const login = (token) => {
    localStorage.setItem('token', token);
    setIsAutenticado(true);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setIsAutenticado(false);
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAutenticado(!!token);
  }, []);

  return (
    <sliceAuth.Provider value={{ isAutenticado, login, logout }}>
      {children}
    </sliceAuth.Provider>
  );
}

export function useAuth() {
  return useContext(sliceAuth);
}
