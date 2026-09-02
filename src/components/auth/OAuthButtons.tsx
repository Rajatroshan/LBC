'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { APP_ROUTES } from '@/core/routes';
import { useToast } from '@/contexts/ToastContext';

interface OAuthButtonsProps {
  mode?: 'signin' | 'signup';
  onError?: (error: string) => void;
  disabled?: boolean;
}

export const OAuthButtons: React.FC<OAuthButtonsProps> = ({
  mode = 'signin',
  onError,
  disabled = false,
}) => {
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const { loginWithGoogle } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  const handleOAuthError = (err: unknown) => {
    let message = 'Failed to authenticate. Please try again.';
    if (err instanceof Error) {
      if (err.message.includes('auth/api-key-not-valid') || err.message.includes('API key')) {
        message = 'Invalid Firebase API Key. Please replace placeholder values in .env.local with your real Firebase Project credentials.';
      } else if (err.message.includes('auth/popup-closed-by-user')) {
        message = 'Sign-in popup was closed before completion.';
      } else if (err.message.includes('auth/popup-blocked')) {
        message = 'Popup was blocked by the browser. Please allow popups for this site.';
      } else if (err.message.includes('auth/account-exists-with-different-credential')) {
        message = 'An account already exists with the same email using a different sign-in method.';
      } else if (err.message.includes('auth/unauthorized-domain')) {
        const domain = typeof window !== 'undefined' ? window.location.hostname : 'this domain';
        message = `Domain "${domain}" is not authorized in Firebase Console > Authentication > Settings > Authorized domains. Please add it to allow sign-in.`;
      } else if (err.message.includes('auth/operation-not-allowed')) {
        message = 'This sign-in provider is not enabled in Firebase Console. Please enable it in Authentication > Sign-in method.';
      } else {
        message = err.message;
      }
    }
    if (onError) {
      onError(message);
    }
    toast.error(message, 'Authentication Error');
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    onError?.('');

    try {
      await loginWithGoogle();
      toast.success('Signed in with Google successfully!', 'Welcome');
      router.replace(APP_ROUTES.DASHBOARD);
    } catch (err) {
      if (err instanceof Error && err.message === 'PENDING_APPROVAL') {
        setIsGoogleLoading(false);
        return;
      }
      handleOAuthError(err);
      setIsGoogleLoading(false);
    }
  };

  const actionText = mode === 'signup' ? 'Sign up' : 'Continue';

  return (
    <div className="w-full">
      {/* Google OAuth Button */}
      <button
        type="button"
        onClick={handleGoogleSignIn}
        disabled={disabled || isGoogleLoading}
        className="w-full flex items-center justify-center gap-3 px-4 py-2.5 bg-white text-gray-700 font-medium border border-gray-300 rounded-lg hover:bg-gray-50 active:bg-gray-100 transition-all duration-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
      >
        {isGoogleLoading ? (
          <svg className="animate-spin h-5 w-5 text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        ) : (
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
            />
            <path
              fill="#34A853"
              d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z"
            />
            <path
              fill="#FBBC05"
              d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.03 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
            />
            <path
              fill="#EA4335"
              d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
            />
          </svg>
        )}
        <span>{actionText} with Google</span>
      </button>
    </div>
  );
};

