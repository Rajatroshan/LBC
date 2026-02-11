'use client';

import { LoginForm } from '@/features/auth/presentation/components/LoginForm';

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-br from-primary-50 to-secondary-50">
      <LoginForm />
    </div>
  );
}
