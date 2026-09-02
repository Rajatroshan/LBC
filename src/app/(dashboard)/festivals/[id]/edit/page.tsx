'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { FestivalForm } from '@/components/festival/FestivalForm';
import { Loader } from '@/components/ui/Loader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { APP_ROUTES } from '@/core/routes';
import { ShieldAlert } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default function EditFestivalPage({ params }: { params: { id: string } }) {
  const { isAdmin, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAdmin) {
      router.replace(APP_ROUTES.FESTIVAL_DETAIL(params.id));
    }
  }, [isAdmin, loading, params.id, router]);

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="max-w-md mx-auto py-12">
        <Card className="text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-gray-900">Access Restricted</h2>
          <p className="text-xs text-gray-500">
            Only Club Administrators have permission to edit community festivals.
          </p>
          <Button onClick={() => router.push(APP_ROUTES.FESTIVAL_DETAIL(params.id))} className="w-full">
            Back to Festival Details
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Edit Festival</h1>
      <FestivalForm festivalId={params.id} /> 
    </div>
  );
}
