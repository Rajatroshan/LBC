'use client';

import { FamilyForm } from '@/components/family/FamilyForm';

export default function EditFamilyPage({ params }: { params: { id: string } }) {
  return (
    <div className="max-w-2xl mx-auto">
      <FamilyForm familyId={params.id} /> 
    </div>
  );
}
