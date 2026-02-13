'use client';

import React, { useEffect, useState } from 'react';
import { dashboardController } from '@/controllers/dashboard.controller';
import { DashboardStats } from '@/models';
import { Card } from '@/components/ui/Card';
import { Loader } from '@/components/ui/Loader';
import { formatCurrency, formatDate } from '@/utils';
import Link from 'next/link';
import { APP_ROUTES } from '@/core/routes';

export const DashboardView: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await dashboardController.getStats();
        setStats(data);
      } catch (err) {
        console.error('Failed to load dashboard stats:', err);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader size="lg" />
      </div>
    );
  }

  if (error || !stats) {
    return (
      <Card>
        <p className="text-red-600">{error || 'Failed to load dashboard'}</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <div className="text-center">
            <p className="text-sm text-gray-500">Total Families</p>
            <p className="text-3xl font-bold text-primary-600">{stats.totalFamilies}</p>
            <p className="text-xs text-gray-400">{stats.activeFamilies} active</p>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <p className="text-sm text-gray-500">Total Festivals</p>
            <p className="text-3xl font-bold text-secondary-600">{stats.totalFestivals}</p>
            <p className="text-xs text-gray-400">{stats.upcomingFestivals} upcoming</p>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <p className="text-sm text-gray-500">Collection This Year</p>
            <p className="text-3xl font-bold text-green-600">{formatCurrency(stats.totalCollectionThisYear)}</p>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <p className="text-sm text-gray-500">Pending Payments</p>
            <p className="text-3xl font-bold text-red-600">{stats.pendingPayments}</p>
          </div>
        </Card>
      </div>

      {/* Upcoming Festivals */}
      <Card>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Upcoming Festivals</h2>
          <Link href={APP_ROUTES.FESTIVALS} className="text-primary-600 hover:underline text-sm">
            View All
          </Link>
        </div>
        {stats.upcomingFestivalsList.length === 0 ? (
          <p className="text-gray-500">No upcoming festivals</p>
        ) : (
          <div className="space-y-3">
            {stats.upcomingFestivalsList.map((festival) => (
              <div key={festival.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-800">{festival.name}</p>
                  <p className="text-sm text-gray-500">{formatDate(festival.date)}</p>
                </div>
                <p className="font-semibold text-primary-600">{formatCurrency(festival.amountPerFamily)}</p>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Recent Payments */}
      <Card>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Recent Payments</h2>
          <Link href={APP_ROUTES.PAYMENTS} className="text-primary-600 hover:underline text-sm">
            View All
          </Link>
        </div>
        {stats.recentPayments.length === 0 ? (
          <p className="text-gray-500">No recent payments</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 text-gray-500">Date</th>
                  <th className="text-left py-2 text-gray-500">Amount</th>
                  <th className="text-left py-2 text-gray-500">Status</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentPayments.slice(0, 5).map((payment) => (
                  <tr key={payment.id} className="border-b last:border-0">
                    <td className="py-2">{formatDate(payment.paidDate)}</td>
                    <td className="py-2">{formatCurrency(payment.amount)}</td>
                    <td className="py-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        payment.status === 'PAID' ? 'bg-green-100 text-green-700' :
                        payment.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {payment.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};
