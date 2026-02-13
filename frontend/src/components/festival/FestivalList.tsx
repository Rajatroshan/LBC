'use client';

import React, { useEffect, useState } from 'react';
import { festivalController } from '@/controllers/festival.controller';
import { Festival } from '@/models';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Loader } from '@/components/ui/Loader';
import { formatDate, formatCurrency } from '@/utils';
import Link from 'next/link';
import { APP_ROUTES } from '@/core/routes';

export const FestivalList: React.FC = () => {
  const [festivals, setFestivals] = useState<Festival[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadFestivals = async () => {
      try {
        const data = await festivalController.getAllFestivals();
        setFestivals(data);
      } catch (err) {
        console.error('Failed to load festivals:', err);
        setError('Failed to load festivals');
      } finally {
        setLoading(false);
      }
    };

    loadFestivals();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Festivals</h1>
        <Link href={APP_ROUTES.FESTIVAL_CREATE}>
          <Button>Add Festival</Button>
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader />
        </div>
      ) : error ? (
        <Card>
          <p className="text-red-600">{error}</p>
        </Card>
      ) : festivals.length === 0 ? (
        <Card>
          <p className="text-center text-gray-500 py-8">No festivals found</p>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {festivals.map((festival) => (
            <Link key={festival.id} href={APP_ROUTES.FESTIVAL_DETAIL(festival.id)}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{festival.name}</h3>
                <div className="space-y-1 text-sm text-gray-600">
                  <p><strong>Type:</strong> {festival.type}</p>
                  <p><strong>Date:</strong> {formatDate(festival.date)}</p>
                  <p><strong>Amount:</strong> {formatCurrency(festival.amountPerFamily)}</p>
                </div>
                <div className="mt-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    festival.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {festival.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};
