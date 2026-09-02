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
  const { 
    loginOrRegister, 
    isPendingApproval, 
    pendingUserEmail, 
    pendingUserName, 
    resetPendingStatus 
  } = useAuth();
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
          'Registration submitted! Your account is awaiting admin approval.', 
          'Submitted'
        );
      } else {
        toast.success(
          'Signed in successfully! Namaste.', 
          'Welcome Back'
        );
        router.push(APP_ROUTES.DASHBOARD);
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Authentication failed');
      const message = error.message || '';

      if (message === 'PENDING_APPROVAL') {
        // Handled via isPendingApproval state
        return;
      }

      if (message === 'ACCOUNT_REJECTED') {
        const rejectMsg = 'Your registration was not approved by the Admin. Please contact rajatroshan2002@gmail.com.';
        setError(rejectMsg);
        toast.error(rejectMsg, 'Account Not Approved');
        return;
      }

      setError(message || 'Failed to authenticate. Please check your credentials.');
      toast.error(message || 'Failed to authenticate. Please check your credentials.', 'Authentication Failed');
    } finally {
      setLoading(false);
    }
  };

  // Dedicated Pending Approval Notice Card
  if (isPendingApproval) {
    return (
      <div className="w-full max-w-md">
        <div className="bg-[#FFFDF7] rounded-3xl shadow-2xl p-6 sm:p-8 border-2 border-amber-300 relative overflow-hidden text-center space-y-4">
          
          {/* Auspicious Toran Garland */}
          <div className="mb-2">
            <MarigoldToran className="opacity-80" />
          </div>

          <div className="w-16 h-16 rounded-3xl bg-amber-100 border-2 border-amber-300 flex items-center justify-center text-3xl mx-auto shadow-xs">
            ⏳
          </div>

          <div className="space-y-1">
            <span className="inline-block px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-[11px] font-black uppercase tracking-wider">
              Verification Required
            </span>
            <h1 className="text-2xl font-black text-stone-900 tracking-tight">
              Admin Approval Pending
            </h1>
            <p className="text-xs text-amber-800 font-bold">
              Namaste, {pendingUserName || 'Gram Sadasya'} 🙏
            </p>
          </div>

          <div className="bg-amber-50/90 border-2 border-amber-200 p-4 rounded-2xl text-left space-y-2 text-xs">
            <p className="text-stone-700 font-medium leading-relaxed">
              Your account for <strong className="text-stone-900">{pendingUserEmail}</strong> has been registered. To maintain village financial integrity, new member accounts require verification by the Admin.
            </p>
            <p className="text-stone-700 font-medium leading-relaxed">
              Till the Admin approves, you cannot access the portal. <strong className="text-emerald-800 font-bold">Once the Admin verifies your account, an automated confirmation email will be sent to your inbox</strong> informing you that you can now log in.
            </p>
          </div>

          {/* Admin Contact Information */}
          <div className="p-3 bg-stone-900 text-white rounded-2xl text-left space-y-1 border border-stone-700">
            <p className="text-[10px] uppercase font-bold text-amber-300">
              Village Administrator
            </p>
            <p className="text-sm font-black text-white">
              Rajat Kumar Sahu
            </p>
            <p className="text-xs text-stone-300 font-medium">
              rajatroshan2002@gmail.com
            </p>
          </div>

          <div className="pt-2 flex flex-col gap-2">
            <a
              href={`mailto:rajatroshan2002@gmail.com?subject=LBC%20Mandap%20Approval%20Request%20-%20${encodeURIComponent(pendingUserEmail || '')}&body=Namaste%20Admin,%20Please%20verify%20and%20approve%20my%20account%20(${encodeURIComponent(pendingUserEmail || '')})%20for%20LBC%20Mandap.`}
              className="w-full py-2.5 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-black text-xs shadow-sm flex items-center justify-center gap-2"
            >
              ✉️ Contact Admin via Email
            </a>
            <button
              type="button"
              onClick={resetPendingStatus}
              className="w-full py-2.5 rounded-2xl border-2 border-amber-300 bg-white hover:bg-amber-50 text-stone-800 font-bold text-xs"
            >
              ← Back to Sign In
            </button>
          </div>
        </div>
      </div>
    );
  }

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
              helperText="Min. 6 characters. If you're new, your account will be created and submitted for admin verification."
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
