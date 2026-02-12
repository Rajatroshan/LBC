'use client';

import { FestivalPaymentReport } from '@/features/reports/presentation/components/FestivalPaymentReport';

export const dynamic = 'force-dynamic';

export default function FestivalReportPage({ params }: { params: { id: string } }) {
  return (
    <div className="space-y-4">
      <FestivalPaymentReport festivalId={params.id} />
    </div>
  );
}
