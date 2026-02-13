'use client';

import { FestivalPaymentReport } from '@/components/reports/FestivalPaymentReport';

export const dynamic = 'force-dynamic';

export default function FestivalReportPage({ params }: { params: { id: string } }) {
  return (
    <div className="space-y-4">
      <FestivalPaymentReport festivalId={params.id} />
    </div>
  );
}
