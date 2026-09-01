'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User as FirebaseUser } from 'firebase/auth';
import { authController } from '@/controllers/auth.controller';
import { User } from '@/models';

interface AuthContextType {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginOrRegister: (email: string, password: string, name?: string) => Promise<{ isNewUser: boolean }>;
  register: (email: string, password: string, name: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginWithGithub: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = authController.onAuthStateChanged(async (fbUser: FirebaseUser | null) => {
      setFirebaseUser(fbUser);
      if (fbUser) {
        try {
          let userDoc = await authController.getUserDocument(fbUser.uid);
          if (!userDoc) {
            // First time login or document pending: sync document now
            await authController.syncOAuthUserDocument(fbUser);
            userDoc = await authController.getUserDocument(fbUser.uid);
          }
          if (!userDoc) {
            // Instant fallback so UI is never blocked
            userDoc = {
              id: fbUser.uid,
              email: fbUser.email || '',
              name: fbUser.displayName || fbUser.email?.split('@')[0] || 'User',
              role: 'USER',
              photoURL: fbUser.photoURL || undefined,
              createdAt: new Date(),
              updatedAt: new Date(),
            };
          }
          setUser(userDoc);
        } catch (error) {
          console.error('Failed to load user document:', error);
          setUser({
            id: fbUser.uid,
            email: fbUser.email || '',
            name: fbUser.displayName || fbUser.email?.split('@')[0] || 'User',
            role: 'USER',
            photoURL: fbUser.photoURL || undefined,
            createdAt: new Date(),
            updatedAt: new Date(),
          });
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    await authController.login(email, password);
  };

  const loginOrRegister = async (email: string, password: string, name?: string) => {
    return await authController.loginOrRegister(email, password, name);
  };

  const register = async (email: string, password: string, name: string) => {
    await authController.register(email, password, name);
  };

  const loginWithGoogle = async () => {
    await authController.loginWithGoogle();
    const fbUser = authController.getCurrentUser();
    if (fbUser) {
      setFirebaseUser(fbUser);
      let userDoc = await authController.getUserDocument(fbUser.uid);
      if (!userDoc) {
        userDoc = {
          id: fbUser.uid,
          email: fbUser.email || '',
          name: fbUser.displayName || fbUser.email?.split('@')[0] || 'User',
          role: 'USER',
          photoURL: fbUser.photoURL || undefined,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
      }
      setUser(userDoc);
    }
  };

  const loginWithGithub = async () => {
    await authController.loginWithGithub();
  };

  const logout = async () => {
    await authController.logout();
    setUser(null);
    setFirebaseUser(null);
  };

  const isAdmin = user?.role === 'ADMIN';

  return (
    <AuthContext.Provider value={{ 
      user, 
      firebaseUser, 
      loading, 
      isAdmin, 
      login, 
      loginOrRegister,
      register, 
      loginWithGoogle,
      loginWithGithub,
      logout 
    }}>
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
