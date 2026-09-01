'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { APP_ROUTES } from '@/core/routes';
import { Loader } from '@/components/ui/Loader';

export default function RegisterPage() {
  const router = useRouter();

  useEffect(() => {
    // Single platform authentication: redirect register to login
    router.replace(APP_ROUTES.LOGIN);
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-br from-primary-50 to-secondary-50">
      <div className="text-center">
        <Loader />
        <p className="text-gray-500 mt-4 text-sm">Redirecting to sign-in...</p>
      </div>
    </div>
  );
}
