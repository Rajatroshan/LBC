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
        setError('');
      } catch (err) {
        console.error('Failed to load dashboard stats:', err);
        const errorMessage = err instanceof Error ? err.message : 'Failed to load dashboard data';
        setError(errorMessage);
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

  if (error) {
    return (
      <Card>
        <div className="p-4">
          <p className="text-red-600 font-semibold mb-2">Error Loading Dashboard</p>
          <p className="text-sm text-gray-600">{error}</p>
          <p className="text-sm text-gray-500 mt-4">
            This might be because:
          </p>
          <ul className="list-disc list-inside text-sm text-gray-600 mt-2 space-y-1">
            <li>Firestore security rules haven't been deployed</li>
            <li>Your database collections are not set up</li>
            <li>You don't have the required permissions</li>
          </ul>
          <p className="text-sm text-gray-500 mt-4">
            Check the browser console (F12) for detailed error messages.
          </p>
        </div>
      </Card>
    );
  }

  if (!stats) {
    return (
      <Card>
        <p className="text-gray-600">No dashboard data available</p>
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
            <p className="text-sm text-gray-500">Expenses This Year</p>
            <p className="text-3xl font-bold text-red-600">{formatCurrency(stats.totalExpenseThisYear)}</p>
          </div>
        </Card>
      </div>

      {/* Account Balance & Net Balance */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <div className="text-center">
            <p className="text-sm text-gray-500">Current Account Balance</p>
            <p className={`text-4xl font-bold ${stats.currentBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(stats.currentBalance)}
            </p>
            <p className="text-xs text-gray-400 mt-2">Available in main account</p>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <p className="text-sm text-gray-500">Net This Year</p>
            <p className={`text-4xl font-bold ${(stats.totalCollectionThisYear - stats.totalExpenseThisYear) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(stats.totalCollectionThisYear - stats.totalExpenseThisYear)}
            </p>
            <p className="text-xs text-gray-400 mt-2">Income - Expenses</p>
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

      {/* Recent Transactions */}
      <Card>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Recent Transactions</h2>
        </div>
        {stats.recentTransactions.length === 0 ? (
          <p className="text-gray-500">No recent transactions</p>
        ) : (
          <div className="space-y-3">
            {stats.recentTransactions.map((transaction) => (
              <div key={transaction.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      transaction.type === 'INCOME' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {transaction.type}
                    </span>
                    <p className="text-sm text-gray-800">{transaction.description}</p>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{formatDate(transaction.date)}</p>
                </div>
                <div className="text-right">
                  <p className={`font-semibold ${transaction.type === 'INCOME' ? 'text-green-600' : 'text-red-600'}`}>
                    {transaction.type === 'INCOME' ? '+' : '-'}{formatCurrency(transaction.amount)}
                  </p>
                  <p className="text-xs text-gray-500">Bal: {formatCurrency(transaction.balanceAfter)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};
