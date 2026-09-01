'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { APP_ROUTES } from '@/core/routes';
import { OAuthButtons } from './OAuthButtons';
import { useToast } from '@/contexts/ToastContext';

export const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { loginOrRegister } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      const msg = 'Password must be at least 6 characters.';
      setError(msg);
      toast.warning(msg, 'Validation Error');
      return;
    }

    setLoading(true);

    try {
      const { isNewUser } = await loginOrRegister(email.trim(), password);
      
      if (isNewUser) {
        toast.success(
          'Account created and signed in successfully! Welcome to LBC.', 
          'Welcome to LBC'
        );
      } else {
        toast.success(
          'Signed in successfully! Redirecting to dashboard...', 
          'Welcome Back'
        );
      }
      
      router.push(APP_ROUTES.DASHBOARD);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Authentication failed');
      const message = error.message || 'Failed to authenticate. Please check your credentials.';
      setError(message);
      toast.error(message, 'Authentication Failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-primary-600 tracking-tight">LBC</h1>
          <p className="text-gray-500 mt-2 text-sm">
            Sign in or get started with your account
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm">
            {error}
          </div>
        )}

        {/* Fast 1-Click OAuth Sign-in / Sign-up */}
        <OAuthButtons mode="signin" onError={setError} disabled={loading} />

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-3 text-gray-500 font-medium">Or continue with email</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@example.com"
            required
            autoComplete="email"
          />

          <div>
            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              minLength={6}
              autoComplete="current-password"
              helperText="Min. 6 characters. If you're new, your account will be created automatically."
            />
          </div>

          <Button
            type="submit"
            className="w-full mt-2"
            isLoading={loading}
            disabled={loading}
          >
            Continue
          </Button>
        </form>

        <div className="mt-6 pt-4 border-t border-gray-100 text-center">
          <p className="text-xs text-gray-400">
            By continuing, you agree to secure access to the LBC Chanda Management platform.
          </p>
        </div>
      </div>
    </div>
  );
};
