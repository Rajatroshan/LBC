'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { APP_ROUTES } from '@/core/routes';
import { Loader } from '@/core/ui';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to login or dashboard
    router.push(APP_ROUTES.LOGIN);
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Loader size="lg" />
    </div>
  );
}
