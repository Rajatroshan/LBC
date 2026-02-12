'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { Festival } from '@/core/types';
import { festivalContainer } from '../../di/festival.container';
import { Card, Button, Loader } from '@/core/ui';
import { formatDate, formatCurrency } from '@/utils';
import Link from 'next/link';
import { APP_ROUTES } from '@/core/routes';
import { useAuth } from '@/features/auth/presentation/context/AuthContext';

export const FestivalList: React.FC = () => {
  const [festivals, setFestivals] = useState<Festival[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { isAdmin } = useAuth();

  const loadFestivals = useCallback(async () => {
    setLoading(true);
    try {
      const getUpcomingFestivalsUseCase = festivalContainer.getUpcomingFestivalsUseCase();
      const data = await getUpcomingFestivalsUseCase.execute(20);
      setFestivals(data);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error.message || 'Failed to load festivals');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadFestivals();
  }, [loadFestivals]);

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <p className="text-red-600">{error}</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Festivals</h2>
        {isAdmin && (
          <Link href={APP_ROUTES.FESTIVAL_CREATE}>
            <Button>Add Festival</Button>
          </Link>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {festivals.map((festival) => (
          <Card key={festival.id} className="hover:shadow-lg transition-shadow">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              {festival.name}
            </h3>
            <div className="space-y-1 text-sm text-gray-600">
              <p>Date: {formatDate(festival.date)}</p>
              <p>Amount: {formatCurrency(festival.amountPerFamily)}</p>
              {festival.description && <p>{festival.description}</p>}
            </div>
            <div className="mt-4 flex gap-2">
              <Link href={APP_ROUTES.FESTIVAL_DETAIL(festival.id)}>
                <Button size="sm" variant="outline">
                  View Details
                </Button>
              </Link>
            </div>
          </Card>
        ))}
      </div>

      {festivals.length === 0 && (
        <Card>
          <p className="text-center text-gray-600">No upcoming festivals</p>
        </Card>
      )}
    </div>
  );
};
