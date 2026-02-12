'use client';

import React, { createContext, useContext, useCallback, useEffect, useState } from 'react';
import { User } from '@/core/types';
import { authContainer } from '../../di/auth.container';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const loadUser = useCallback(async () => {
    try {
      const getCurrentUserUseCase = authContainer.getCurrentUserUseCase();
      const currentUser = await getCurrentUserUseCase.execute();
      setUser(currentUser);
    } catch (error) {
      console.error('Failed to load user:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const login = useCallback(async (email: string, password: string) => {
    setLoading(true);
    try {
      const loginUseCase = authContainer.loginUseCase();
      const user = await loginUseCase.execute({ email, password });
      setUser(user);
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (email: string, password: string, name: string) => {
    setLoading(true);
    try {
      const registerUseCase = authContainer.registerUseCase();
      const user = await registerUseCase.execute({ email, password, name });
      setUser(user);
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setLoading(true);
    try {
      const logoutUseCase = authContainer.logoutUseCase();
      await logoutUseCase.execute();
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const isAdmin = user?.role === 'ADMIN';

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
