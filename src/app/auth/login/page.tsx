'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { LoginForm } from '@/components/auth/LoginForm';
import { APP_ROUTES } from '@/core/routes';
import { Loader } from '@/components/ui/Loader';

export default function LoginPage() {
  const { user, firebaseUser, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (user || firebaseUser)) {
      router.replace(APP_ROUTES.DASHBOARD);
    }
  }, [user, firebaseUser, loading, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
        <Loader size="lg" />
      </div>
    );
  }

  if (user || firebaseUser) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
        <div className="text-center">
          <Loader size="lg" />
          <p className="text-gray-500 mt-4 text-sm font-medium">Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-br from-primary-50 to-secondary-50">
      <LoginForm />
    </div>
  );
}
