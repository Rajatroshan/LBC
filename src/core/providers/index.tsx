'use client';

import React from 'react';
import { FirebaseProvider } from '@/core/providers/FirebaseProvider';
import { AuthProvider } from '@/features/auth/presentation/context/AuthContext';

/**
 * Root Providers
 * Wraps the app with all necessary providers
 */
export const AppProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <FirebaseProvider>
      <AuthProvider>
        {children}
      </AuthProvider>
    </FirebaseProvider>
  );
};
