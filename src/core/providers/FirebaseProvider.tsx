'use client';

import React, { useEffect, useState } from 'react';
import { Loader } from '@/components/ui/Loader';

/**
 * Firebase Provider
 * Initializes Firebase on app startup by importing the firebase lib
 */
export const FirebaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [initialized, setInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      try {
        // Import firebase lib to trigger initialization
        await import('@/lib/firebase');
        setInitialized(true);
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Unknown error');
        console.error('Failed to initialize Firebase:', error);
        setError(error.message || 'Failed to initialize Firebase');
      }
    };

    init();
  }, []);

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center p-6 bg-red-50 border border-red-200 rounded-lg max-w-md">
          <h2 className="text-xl font-bold text-red-700 mb-2">Initialization Error</h2>
          <p className="text-red-600">{error}</p>
          <p className="text-sm text-gray-600 mt-4">
            Please check your Firebase configuration in .env file
          </p>
        </div>
      </div>
    );
  }

  if (!initialized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader size="lg" />
          <p className="mt-4 text-gray-600">Initializing application...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
