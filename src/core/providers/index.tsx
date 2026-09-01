'use client';

import React from 'react';
import { FirebaseProvider } from '@/core/providers/FirebaseProvider';
import { AuthProvider } from '@/contexts/AuthContext';
import { ToastProvider } from '@/contexts/ToastContext';

/**
 * Root Providers
 * Wraps the app with all necessary providers
 */
export const AppProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <FirebaseProvider>
      <AuthProvider>
        <ToastProvider>
          {children}
        </ToastProvider>
      </AuthProvider>
    </FirebaseProvider>
  );
};
