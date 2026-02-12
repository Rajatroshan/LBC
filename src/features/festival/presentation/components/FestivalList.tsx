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
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const { isAdmin } = useAuth();

  const loadFestivals = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const getFestivalsUseCase = festivalContainer.getFestivalsUseCase();
      const data = await getFestivalsUseCase.execute();
      // Sort by date, upcoming first
      const sorted = data.sort((a, b) => a.date.getTime() - b.date.getTime());
      setFestivals(sorted);
    } catch (err) {
      console.error('Failed to load festivals:', err);
      setError('Could not load festivals. Please check your connection.');
      setFestivals([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadFestivals();
  }, [loadFestivals]);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete the festival "${name}"? This action cannot be undone.`)) {
      return;
    }

    setDeletingId(id);
    try {
      const deleteFestivalUseCase = festivalContainer.deleteFestivalUseCase();
      await deleteFestivalUseCase.execute(id);
      // Reload the list after deletion
      await loadFestivals();
    } catch (err) {
      console.error('Failed to delete festival:', err);
      alert('Failed to delete festival. Please try again.');
    } finally {
      setDeletingId(null);
    }
  };

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
        <Button onClick={loadFestivals} className="mt-4">Retry</Button>
      </Card>
    );
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const upcomingFestivals = festivals.filter((f) => f.date >= today);
  const pastFestivals = festivals.filter((f) => f.date < today);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Festivals</h2>
        {isAdmin && (
          <Link href={APP_ROUTES.FESTIVAL_CREATE}>
            <Button>Add Festival</Button>
          </Link>
        )}
      </div>

      {/* Upcoming Festivals */}
      {upcomingFestivals.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold text-gray-700 mb-3">Upcoming Festivals</h3>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {upcomingFestivals.map((festival) => (
              <Card key={festival.id} className="hover:shadow-lg transition-shadow border-l-4 border-l-green-500">
                <h4 className="text-lg font-semibold text-gray-800 mb-2">
                  {festival.name}
                </h4>
                <div className="space-y-1 text-sm text-gray-600">
                  <p>Type: {festival.type}</p>
                  <p>Date: {formatDate(festival.date)}</p>
                  <p>Amount: {formatCurrency(festival.amountPerFamily)}</p>
                  {festival.description && (
                    <p className="text-xs mt-2">{festival.description}</p>
                  )}
                </div>
                {isAdmin && (
                  <div className="mt-4 flex gap-2">
                    <Link href={APP_ROUTES.FESTIVAL_DETAIL(festival.id)}>
                      <Button size="sm" variant="outline">
                        View
                      </Button>
                    </Link>
                    <Link href={`/festivals/${festival.id}/edit`}>
                      <Button size="sm" variant="outline">
                        Edit
                      </Button>
                    </Link>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(festival.id, festival.name)}
                      disabled={deletingId === festival.id}
                    >
                      {deletingId === festival.id ? 'Deleting...' : 'Delete'}
                    </Button>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Past Festivals */}
      {pastFestivals.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold text-gray-700 mb-3">Past Festivals</h3>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {pastFestivals.map((festival) => (
              <Card key={festival.id} className="hover:shadow-lg transition-shadow border-l-4 border-l-gray-400 opacity-75">
                <h4 className="text-lg font-semibold text-gray-800 mb-2">
                  {festival.name}
                </h4>
                <div className="space-y-1 text-sm text-gray-600">
                  <p>Type: {festival.type}</p>
                  <p>Date: {formatDate(festival.date)}</p>
                  <p>Amount: {formatCurrency(festival.amountPerFamily)}</p>
                  {festival.description && (
                    <p className="text-xs mt-2">{festival.description}</p>
                  )}
                </div>
                {isAdmin && (
                  <div className="mt-4 flex gap-2">
                    <Link href={APP_ROUTES.FESTIVAL_DETAIL(festival.id)}>
                      <Button size="sm" variant="outline">
                        View
                      </Button>
                    </Link>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(festival.id, festival.name)}
                      disabled={deletingId === festival.id}
                    >
                      {deletingId === festival.id ? 'Deleting...' : 'Delete'}
                    </Button>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      )}

      {festivals.length === 0 && (
        <Card>
          <p className="text-center text-gray-600">No festivals found</p>
        </Card>
      )}
    </div>
  );
};
