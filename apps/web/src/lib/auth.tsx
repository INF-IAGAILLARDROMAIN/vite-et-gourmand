'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { auth as authApi } from './api';

interface AuthUser {
  id: number;
  email: string;
  nom: string;
  prenom: string;
  role: string;
}

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: { email: string; password: string; nom: string; prenom: string; telephone: string; adressePostale: string }) => Promise<void>;
  logout: () => void;
  isAdmin: boolean;
  isEmployee: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const res = await authApi.login({ email, password });
    setToken(res.access_token);
    setUser(res.user);
    localStorage.setItem('token', res.access_token);
    localStorage.setItem('user', JSON.stringify(res.user));
  }, []);

  const register = useCallback(async (data: { email: string; password: string; nom: string; prenom: string; telephone: string; adressePostale: string }) => {
    await authApi.register(data);
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }, []);

  const isAdmin = user?.role === 'administrateur';
  const isEmployee = user?.role === 'employe' || isAdmin;

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, isAdmin, isEmployee }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
