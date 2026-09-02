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
  isPendingApproval: boolean;
  pendingUserEmail: string | null;
  pendingUserName: string | null;
  resetPendingStatus: () => void;
  login: (email: string, password: string) => Promise<void>;
  loginOrRegister: (email: string, password: string, name?: string) => Promise<{ isNewUser: boolean }>;
  register: (email: string, password: string, name: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginWithGithub: () => Promise<void>;
  logout: () => Promise<void>;
  approveMember: (userId: string, memberUser: { name: string; email: string }) => Promise<void>;
  rejectMember: (userId: string, reason: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPendingApproval, setIsPendingApproval] = useState(false);
  const [pendingUserEmail, setPendingUserEmail] = useState<string | null>(null);
  const [pendingUserName, setPendingUserName] = useState<string | null>(null);

  const resetPendingStatus = () => {
    setIsPendingApproval(false);
    setPendingUserEmail(null);
    setPendingUserName(null);
  };

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

          if (userDoc) {
            // Check approval status: if member is pending approval, block dashboard access
            if (userDoc.role !== 'ADMIN' && userDoc.approvalStatus === 'PENDING_APPROVAL') {
              setIsPendingApproval(true);
              setPendingUserEmail(userDoc.email);
              setPendingUserName(userDoc.name);
              setUser(null);
              await authController.logout();
              setLoading(false);
              return;
            }

            if (userDoc.role !== 'ADMIN' && userDoc.approvalStatus === 'REJECTED') {
              setUser(null);
              await authController.logout();
              setLoading(false);
              return;
            }

            setUser(userDoc);
          }
        } catch (error) {
          console.error('Failed to load user document:', error);
          setUser(null);
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
    const fbUser = authController.getCurrentUser();
    if (fbUser) {
      const userDoc = await authController.getUserDocument(fbUser.uid);
      if (userDoc && userDoc.role !== 'ADMIN' && userDoc.approvalStatus === 'PENDING_APPROVAL') {
        setIsPendingApproval(true);
        setPendingUserEmail(userDoc.email);
        setPendingUserName(userDoc.name);
        await authController.logout();
        throw new Error('PENDING_APPROVAL');
      }
      if (userDoc && userDoc.role !== 'ADMIN' && userDoc.approvalStatus === 'REJECTED') {
        await authController.logout();
        throw new Error('ACCOUNT_REJECTED');
      }
      setUser(userDoc);
    }
  };

  const loginOrRegister = async (email: string, password: string, name?: string) => {
    const result = await authController.loginOrRegister(email, password, name);
    const fbUser = authController.getCurrentUser();
    if (fbUser) {
      const userDoc = await authController.getUserDocument(fbUser.uid);
      if (userDoc && userDoc.role !== 'ADMIN' && userDoc.approvalStatus === 'PENDING_APPROVAL') {
        setIsPendingApproval(true);
        setPendingUserEmail(userDoc.email);
        setPendingUserName(userDoc.name);
        await authController.logout();
        throw new Error('PENDING_APPROVAL');
      }
      if (userDoc && userDoc.role !== 'ADMIN' && userDoc.approvalStatus === 'REJECTED') {
        await authController.logout();
        throw new Error('ACCOUNT_REJECTED');
      }
      setUser(userDoc);
    }
    return result;
  };

  const register = async (email: string, password: string, name: string) => {
    await authController.register(email, password, name);
    const fbUser = authController.getCurrentUser();
    if (fbUser) {
      const userDoc = await authController.getUserDocument(fbUser.uid);
      if (userDoc && userDoc.role !== 'ADMIN' && userDoc.approvalStatus === 'PENDING_APPROVAL') {
        setIsPendingApproval(true);
        setPendingUserEmail(userDoc.email);
        setPendingUserName(userDoc.name);
        await authController.logout();
        throw new Error('PENDING_APPROVAL');
      }
      setUser(userDoc);
    }
  };

  const loginWithGoogle = async () => {
    await authController.loginWithGoogle();
    const fbUser = authController.getCurrentUser();
    if (fbUser) {
      const userDoc = await authController.getUserDocument(fbUser.uid);
      if (userDoc && userDoc.role !== 'ADMIN' && userDoc.approvalStatus === 'PENDING_APPROVAL') {
        setIsPendingApproval(true);
        setPendingUserEmail(userDoc.email);
        setPendingUserName(userDoc.name);
        await authController.logout();
        throw new Error('PENDING_APPROVAL');
      }
      if (userDoc && userDoc.role !== 'ADMIN' && userDoc.approvalStatus === 'REJECTED') {
        await authController.logout();
        throw new Error('ACCOUNT_REJECTED');
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
    resetPendingStatus();
  };

  const approveMember = async (userId: string, memberUser: { name: string; email: string }) => {
    if (!user) throw new Error('Must be logged in to approve members');
    await authController.approveUser(userId, memberUser, {
      id: user.id,
      name: user.name,
      email: user.email,
    });
  };

  const rejectMember = async (userId: string, reason: string) => {
    if (!user) throw new Error('Must be logged in to reject members');
    await authController.rejectUser(userId, reason, {
      id: user.id,
      name: user.name,
      email: user.email,
    });
  };

  const isAdmin = user?.role === 'ADMIN';

  return (
    <AuthContext.Provider value={{ 
      user, 
      firebaseUser, 
      loading, 
      isAdmin, 
      isPendingApproval,
      pendingUserEmail,
      pendingUserName,
      resetPendingStatus,
      login, 
      loginOrRegister,
      register, 
      loginWithGoogle,
      loginWithGithub,
      logout,
      approveMember,
      rejectMember,
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
