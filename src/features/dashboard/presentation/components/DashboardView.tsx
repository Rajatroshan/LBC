'use client';

import React, { useEffect, useState } from 'react';
import { DashboardStats } from '@/core/types';
import { dashboardContainer } from '../../di/dashboard.container';
import { Card, Loader } from '@/core/ui';
import { formatCurrency } from '@/utils';

export const DashboardView: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const getDashboardStatsUseCase = dashboardContainer.getDashboardStatsUseCase();

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    setLoading(true);
    try {
      const data = await getDashboardStatsUseCase.execute();
      setStats(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load dashboard stats');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader />
      </div>
    );
  }

  if (error || !stats) {
    return (
      <Card>
        <p className="text-red-600">{error || 'No data available'}</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-primary-50 to-primary-100">
          <h3 className="text-sm font-medium text-gray-600">Total Families</h3>
          <p className="text-3xl font-bold text-primary-700 mt-2">
            {stats.totalFamilies}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {stats.activeFamilies} active
          </p>
        </Card>

        <Card className="bg-gradient-to-br from-secondary-50 to-secondary-100">
          <h3 className="text-sm font-medium text-gray-600">Festivals</h3>
          <p className="text-3xl font-bold text-secondary-700 mt-2">
            {stats.totalFestivals}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {stats.upcomingFestivals} upcoming
          </p>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100">
          <h3 className="text-sm font-medium text-gray-600">Collection (This Year)</h3>
          <p className="text-3xl font-bold text-green-700 mt-2">
            {formatCurrency(stats.totalCollectionThisYear)}
          </p>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-red-100">
          <h3 className="text-sm font-medium text-gray-600">Pending Payments</h3>
          <p className="text-3xl font-bold text-red-700 mt-2">
            {stats.pendingPayments}
          </p>
        </Card>
      </div>

      {/* Upcoming Festivals */}
      <Card>
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          Upcoming Festivals
        </h2>
        {stats.upcomingFestivalsList.length > 0 ? (
          <div className="space-y-2">
            {stats.upcomingFestivalsList.map((festival) => (
              <div
                key={festival.id}
                className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
              >
                <div>
                  <p className="font-medium text-gray-800">{festival.name}</p>
                  <p className="text-sm text-gray-600">
                    {festival.date.toLocaleDateString()}
                  </p>
                </div>
                <p className="font-semibold text-primary-600">
                  {formatCurrency(festival.amountPerFamily)}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No upcoming festivals</p>
        )}
      </Card>

      {/* Recent Payments */}
      <Card>
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          Recent Payments
        </h2>
        {stats.recentPayments.length > 0 ? (
          <div className="space-y-2">
            {stats.recentPayments.map((payment) => (
              <div
                key={payment.id}
                className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
              >
                <div>
                  <p className="font-medium text-gray-800">
                    Receipt: {payment.receiptNumber}
                  </p>
                  <p className="text-sm text-gray-600">
                    {payment.paidDate.toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-green-600">
                    {formatCurrency(payment.amount)}
                  </p>
                  <p className="text-xs text-gray-500">{payment.status}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No recent payments</p>
        )}
      </Card>
    </div>
  );
};
