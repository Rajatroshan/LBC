'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { APP_ROUTES } from '@/core/routes';
import { OAuthButtons } from './OAuthButtons';
import { useToast } from '@/contexts/ToastContext';
import { CartoonDiya, MarigoldToran } from '@/app/(landing)/components/VillageIllustrations';

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
          'Account created and signed in successfully! Welcome to LBC Village Portal.', 
          'Subh Agaman'
        );
      } else {
        toast.success(
          'Signed in successfully! Namaste.', 
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
      <div className="bg-[#FFFDF7] rounded-3xl shadow-2xl p-6 sm:p-8 border-2 border-amber-300 relative overflow-hidden">
        
        {/* Auspicious Marigold Toran on Top */}
        <div className="mb-4">
          <MarigoldToran className="opacity-80" />
        </div>

        <div className="text-center mb-6 space-y-2">
          <div className="flex justify-center">
            <CartoonDiya size={48} />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
            LBC Village Mandap
          </h1>
          <p className="text-stone-600 text-xs sm:text-sm font-semibold">
            🙏 Subh Agaman • Access Gram Chanda &amp; Accounts
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border-2 border-red-200 text-red-800 px-4 py-3 rounded-2xl mb-5 text-xs font-bold">
            {error}
          </div>
        )}

        {/* Fast 1-Click OAuth Sign-in / Sign-up */}
        <OAuthButtons mode="signin" onError={setError} disabled={loading} />

        <div className="relative my-5">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t-2 border-dashed border-amber-200" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-[#FFFDF7] px-3 text-amber-800 font-black">Or with Email</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="kisan@example.com"
            required
            autoComplete="email"
            className="rounded-2xl border-2 border-amber-200 bg-white"
          />

          <div>
            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your secret password"
              required
              minLength={6}
              autoComplete="current-password"
              helperText="Min. 6 characters. If you're new, your account will be created automatically."
              className="rounded-2xl border-2 border-amber-200 bg-white"
            />
          </div>

          <Button
            type="submit"
            className="w-full mt-2 py-3 rounded-2xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 text-white font-black text-sm shadow-md hover:shadow-lg border-2 border-amber-200"
            isLoading={loading}
            disabled={loading}
          >
            Enter Village Mandap →
          </Button>
        </form>

        <div className="mt-6 pt-4 border-t-2 border-dashed border-amber-200 text-center space-y-1">
          <p className="text-[10px] text-stone-500 font-medium">
            🌾 100% Transparent &amp; Safe Community Accounting
          </p>
        </div>
      </div>
    </div>
  );
};
