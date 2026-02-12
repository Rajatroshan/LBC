'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { Festival } from '@/core/types';
import { festivalContainer } from '@/features/festival/di/festival.container';
import { Card, Button, Loader } from '@/core/ui';
import { formatDate, formatCurrency } from '@/utils';
import Link from 'next/link';
import { APP_ROUTES } from '@/core/routes';

export default function ReportsPage() {
  const [festivals, setFestivals] = useState<Festival[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadFestivals = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const getUpcomingFestivalsUseCase = festivalContainer.getUpcomingFestivalsUseCase();
      const festivalsData = await getUpcomingFestivalsUseCase.execute(100);
      setFestivals(festivalsData);
    } catch (err) {
      console.error('Failed to load festivals:', err);
      // Show a warning but don't block the UI completely
      setError('Note: Could not load some festival data. Please check your Firebase connection.');
      setFestivals([]);
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

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Reports & Analytics</h1>
      </div>

      {error && (
        <Card className="bg-yellow-50 border border-yellow-200">
          <p className="text-yellow-700">{error}</p>
        </Card>
      )}

      {festivals.length === 0 ? (
        <Card>
          <p className="text-center text-gray-600 py-8">
            {error ? 'Unable to load festivals' : 'No festivals available for reports'}
          </p>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {festivals.map((festival) => (
            <Card key={festival.id} className="hover:shadow-lg transition-shadow">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">{festival.name}</h3>
              <div className="space-y-2 text-sm text-gray-600 mb-4">
                <p>
                  <strong>Date:</strong> {formatDate(festival.date)}
                </p>
                <p>
                  <strong>Type:</strong> {festival.type}
                </p>
                <p>
                  <strong>Amount:</strong> {formatCurrency(festival.amountPerFamily)}
                </p>
              </div>
              <Link href={APP_ROUTES.REPORT_FESTIVAL(festival.id)}>
                <Button className="w-full">View Report</Button>
              </Link>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
