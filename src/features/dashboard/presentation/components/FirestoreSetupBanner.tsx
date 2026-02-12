'use client';

import React from 'react';
import { Card } from '@/core/ui';

export const FirestoreSetupBanner: React.FC = () => {
  const [dismissed, setDismissed] = React.useState(false);

  React.useEffect(() => {
    const isDismissed = localStorage.getItem('firestore-setup-dismissed');
    if (isDismissed) {
      setDismissed(true);
    }
  }, []);

  const handleDismiss = () => {
    localStorage.setItem('firestore-setup-dismissed', 'true');
    setDismissed(true);
  };

  if (dismissed) return null;

  return (
    <Card className="border-2 border-blue-200 bg-blue-50 mb-6">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-lg font-semibold text-blue-900">🚀 First Time Setup</h3>
          </div>
          <p className="text-sm text-blue-800 mb-3">
            Welcome! Your app is running but needs Firestore database configuration.
          </p>
          <div className="space-y-2 text-sm text-blue-700">
            <div className="flex items-start gap-2">
              <span className="font-bold mt-0.5">1.</span>
              <div>
                <strong>Set Firestore Rules:</strong>
                <p className="text-xs mt-1">
                  Go to <a href="https://console.firebase.google.com/project/lbc-chanda-management/firestore/rules" target="_blank" rel="noopener noreferrer" className="underline font-medium">Firebase Console → Firestore → Rules</a> and update security rules
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-bold mt-0.5">2.</span>
              <div>
                <strong>Create Admin User:</strong>
                <p className="text-xs mt-1">
                  In Firestore Data tab, add your user to the <code className="bg-blue-100 px-1 rounded">users</code> collection with <code className="bg-blue-100 px-1 rounded">role: "ADMIN"</code>
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-bold mt-0.5">3.</span>
              <div>
                <strong>Start Adding Data:</strong>
                <p className="text-xs mt-1">
                  Use the "Create" or "Add" buttons in each section to populate your database
                </p>
              </div>
            </div>
          </div>
          <a 
            href="https://github.com/yourusername/lbc-next/blob/main/FIRESTORE_SETUP.md" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-block mt-3 text-sm font-medium text-blue-700 hover:text-blue-900 underline"
          >
            📖 View Full Setup Guide
          </a>
        </div>
        <button
          onClick={handleDismiss}
          className="ml-4 text-blue-600 hover:text-blue-800 font-bold text-xl"
          title="Dismiss"
        >
          ×
        </button>
      </div>
    </Card>
  );
};
