'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { Festival } from '@/core/types';
import { festivalContainer } from '@/features/festival/di/festival.container';
import { Card, Loader } from '@/core/ui';
import { formatDate, formatCurrency } from '@/utils';
import { PaymentList } from '@/features/payments/presentation/components/PaymentList';

export const dynamic = 'force-dynamic';

export default function FestivalDetailPage({ params }: { params: { id: string } }) {
  const [festival, setFestival] = useState<Festival | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const getUpcomingFestivalsUseCase = festivalContainer.getUpcomingFestivalsUseCase();

  const loadFestival = useCallback(async () => {
    setLoading(true);
    try {
      const festivals = await getUpcomingFestivalsUseCase.execute(100);
      const selectedFestival = festivals.find((f) => f.id === params.id);
      if (!selectedFestival) {
        setError('Festival not found');
      } else {
        setFestival(selectedFestival);
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error.message || 'Failed to load festival');
    } finally {
      setLoading(false);
    }
  }, [params.id, getUpcomingFestivalsUseCase]);

  useEffect(() => {
    loadFestival();
  }, [loadFestival]);

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader />
      </div>
    );
  }

  if (error || !festival) {
    return (
      <Card>
        <p className="text-red-600">{error || 'Festival not found'}</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">{festival.name}</h1>
            <div className="space-y-2 text-gray-600">
              <p>
                <strong>Type:</strong> {festival.type}
              </p>
              <p>
                <strong>Date:</strong> {formatDate(festival.date)}
              </p>
              <p>
                <strong>Amount Per Family:</strong> {formatCurrency(festival.amountPerFamily)}
              </p>
              {festival.description && (
                <p>
                  <strong>Description:</strong> {festival.description}
                </p>
              )}
            </div>
          </div>
          <div className="text-right">
            <span
              className={`inline-block px-4 py-2 rounded-full text-sm font-medium ${
                festival.isActive
                  ? 'bg-green-100 text-green-800'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              {festival.isActive ? 'Active' : 'Inactive'}
            </span>
          </div>
        </div>
      </Card>

      <PaymentList festivalId={festival.id} />
    </div>
  );
}
