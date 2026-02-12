'use client';

import { FestivalForm } from '@/features/festival/presentation/components/FestivalForm';

export default function EditFestivalPage({ params }: { params: { id: string } }) {
  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Edit Festival</h1>
      <FestivalForm festivalId={params.id} />
    </div>
  );
}
