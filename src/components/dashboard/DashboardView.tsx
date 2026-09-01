'use client';

import React, { useEffect, useState } from 'react';
import { dashboardController } from '@/controllers/dashboard.controller';
import { DashboardStats } from '@/models';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Loader } from '@/components/ui/Loader';
import { formatCurrency, formatDate } from '@/utils';
import Link from 'next/link';
import { APP_ROUTES } from '@/core/routes';
import { 
  Users, 
  Sparkles, 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  PlusCircle, 
  ArrowUpRight, 
  ArrowDownRight, 
  Calendar, 
  RefreshCw,
  Clock,
  Receipt,
  FileText
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const loadStats = async (isManualRefresh = false) => {
    if (isManualRefresh) setRefreshing(true);
    else setLoading(true);

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
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-24">
        <Loader size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <div className="p-4 text-center">
          <p className="text-red-600 font-semibold mb-2 text-lg">Error Loading Dashboard</p>
          <p className="text-sm text-gray-600 mb-6">{error}</p>
          <Button onClick={() => loadStats()} className="mx-auto">
            Retry Loading
          </Button>
        </div>
      </Card>
    );
  }

  if (!stats) {
    return (
      <Card>
        <p className="text-gray-600 text-center py-8">No dashboard data available</p>
      </Card>
    );
  }

  const currentYear = new Date().getFullYear();
  const netThisYear = stats.totalCollectionThisYear - stats.totalExpenseThisYear;

  return (
    <div className="space-y-6">
      {/* Top Header & Quick Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">Financial & Community Dashboard</h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">Real-time overview for {currentYear} festivals, family collections & expenditures</p>
        </div>

        <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto">
          <Button
            size="sm"
            variant="outline"
            onClick={() => loadStats(true)}
            isLoading={refreshing}
            disabled={refreshing}
            className="flex items-center gap-1.5 text-xs text-gray-700 hover:bg-gray-50 border-gray-300"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>

          <Link href={APP_ROUTES.PAYMENT_RECORD}>
            <Button size="sm" className="flex items-center gap-1.5 text-xs bg-primary-600 hover:bg-primary-700 shadow-xs">
              <PlusCircle className="w-3.5 h-3.5" />
              Record Payment
            </Button>
          </Link>

          <Link href={APP_ROUTES.EXPENSE_RECORD}>
            <Button size="sm" variant="secondary" className="flex items-center gap-1.5 text-xs shadow-xs">
              <ArrowDownRight className="w-3.5 h-3.5" />
              Add Expense
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Main Balance Card */}
        <Card className="border-l-4 border-l-primary-500 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Available Balance</p>
              <p className={`text-2xl sm:text-3xl font-extrabold mt-1 tracking-tight ${
                stats.currentBalance >= 0 ? 'text-primary-700' : 'text-red-600'
              }`}>
                {formatCurrency(stats.currentBalance)}
              </p>
              <p className="text-[11px] text-gray-400 mt-1 flex items-center gap-1">
                <Wallet className="w-3 h-3 text-gray-400" />
                Live account balance
              </p>
            </div>
            <div className="p-2.5 bg-primary-50 text-primary-600 rounded-xl">
              <Wallet className="w-5 h-5" />
            </div>
          </div>
        </Card>

        {/* Collections This Year Card */}
        <Card className="border-l-4 border-l-emerald-500 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Collections ({currentYear})</p>
              <p className="text-2xl sm:text-3xl font-extrabold text-emerald-600 mt-1 tracking-tight">
                {formatCurrency(stats.totalCollectionThisYear)}
              </p>
              <p className="text-[11px] text-gray-400 mt-1">
                All-time: <span className="font-semibold text-gray-600">{formatCurrency(stats.allTimeCollection)}</span>
              </p>
            </div>
            <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
        </Card>

        {/* Expenses This Year Card */}
        <Card className="border-l-4 border-l-rose-500 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Expenses ({currentYear})</p>
              <p className="text-2xl sm:text-3xl font-extrabold text-rose-600 mt-1 tracking-tight">
                {formatCurrency(stats.totalExpenseThisYear)}
              </p>
              <p className="text-[11px] text-gray-400 mt-1">
                All-time: <span className="font-semibold text-gray-600">{formatCurrency(stats.allTimeExpense)}</span>
              </p>
            </div>
            <div className="p-2.5 bg-rose-50 text-rose-600 rounded-xl">
              <TrendingDown className="w-5 h-5" />
            </div>
          </div>
        </Card>

        {/* Registered Families Card */}
        <Card className="border-l-4 border-l-sky-500 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Registered Families</p>
              <p className="text-2xl sm:text-3xl font-extrabold text-sky-700 mt-1 tracking-tight">
                {stats.totalFamilies}
              </p>
              <p className="text-[11px] text-gray-400 mt-1">
                <span className="font-semibold text-emerald-600">{stats.activeFamilies} active</span> contributing
              </p>
            </div>
            <div className="p-2.5 bg-sky-50 text-sky-600 rounded-xl">
              <Users className="w-5 h-5" />
            </div>
          </div>
        </Card>
      </div>

      {/* Net Year Surplus & Festival Overview Strip */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Net Surplus Card */}
        <Card className="bg-gradient-to-br from-gray-900 to-gray-800 text-white shadow-md">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs uppercase font-medium text-gray-300 tracking-wider">Annual Net Surplus ({currentYear})</p>
              <p className={`text-3xl font-black mt-2 tracking-tight ${
                netThisYear >= 0 ? 'text-emerald-400' : 'text-rose-400'
              }`}>
                {formatCurrency(netThisYear)}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Total Collections minus Expenses in {currentYear}
              </p>
            </div>
            <div className={`p-2.5 rounded-xl ${netThisYear >= 0 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
              {netThisYear >= 0 ? <ArrowUpRight className="w-6 h-6" /> : <ArrowDownRight className="w-6 h-6" />}
            </div>
          </div>
        </Card>

        {/* Active Festivals Summary */}
        <Card className="hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Active Festivals</p>
              <p className="text-3xl font-extrabold text-gray-800 mt-1 tracking-tight">
                {stats.activeFestivalsCount}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                <span className="font-semibold text-primary-600">{stats.upcomingFestivals} upcoming</span> / {stats.totalFestivals} total recorded
              </p>
            </div>
            <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl">
              <Sparkles className="w-5 h-5" />
            </div>
          </div>
        </Card>

        {/* Pending Collections / Unpaid */}
        <Card className="hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Pending / Unpaid Logs</p>
              <p className="text-3xl font-extrabold text-gray-800 mt-1 tracking-tight">
                {stats.pendingPayments}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {stats.pendingPayments === 0 ? 'All recorded payments verified' : 'Requires follow-up collection'}
              </p>
            </div>
            <div className="p-2.5 bg-purple-50 text-purple-600 rounded-xl">
              <Receipt className="w-5 h-5" />
            </div>
          </div>
        </Card>
      </div>

      {/* Main Content: Upcoming Festivals & Recent Payments */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Upcoming Festivals (1 Col) */}
        <div className="space-y-4">
          <Card>
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary-600" />
                <h2 className="text-lg font-bold text-gray-900">Upcoming Festivals</h2>
              </div>
              <Link href={APP_ROUTES.FESTIVALS} className="text-primary-600 hover:text-primary-700 text-xs font-semibold hover:underline">
                View All →
              </Link>
            </div>

            {stats.upcomingFestivalsList.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                <Calendar className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                <p className="text-xs text-gray-500">No upcoming festivals scheduled.</p>
                <Link href={APP_ROUTES.FESTIVAL_CREATE} className="text-xs text-primary-600 font-semibold mt-2 inline-block hover:underline">
                  + Schedule a festival
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {stats.upcomingFestivalsList.map((festival) => {
                  const isMultiDay = Boolean(festival.endDate && festival.isMultiDay);
                  const diffDays = isMultiDay && festival.endDate
                    ? Math.ceil((new Date(festival.endDate).getTime() - new Date(festival.date).getTime()) / (1000 * 60 * 60 * 24)) + 1
                    : 1;

                  return (
                    <Link key={festival.id} href={APP_ROUTES.FESTIVAL_DETAIL(festival.id)}>
                      <div className="p-3.5 bg-gray-50/80 hover:bg-primary-50/60 border border-gray-200/80 hover:border-primary-300 rounded-xl transition-all duration-150">
                        <div className="flex justify-between items-start gap-2">
                          <p className="font-semibold text-gray-900 text-sm">{festival.name}</p>
                          <span className="font-bold text-primary-700 text-xs bg-white px-2 py-0.5 rounded-md border border-gray-200 shadow-2xs shrink-0">
                            {formatCurrency(festival.amountPerFamily)}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-2">
                          {isMultiDay ? <Clock className="w-3.5 h-3.5 text-primary-600 shrink-0" /> : <Calendar className="w-3.5 h-3.5 text-primary-600 shrink-0" />}
                          <span>
                            {formatDate(festival.date)}
                            {isMultiDay && festival.endDate ? ` – ${formatDate(festival.endDate)} (${diffDays}d)` : ''}
                          </span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </Card>

          {/* Quick Links Card */}
          <Card>
            <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-primary-600" />
              Quick Navigation
            </h3>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <Link href={APP_ROUTES.FAMILIES} className="p-2.5 bg-gray-50 hover:bg-gray-100 rounded-lg text-gray-700 font-medium text-center border border-gray-200/60 transition-colors">
                👨‍👩‍👧‍👦 Families
              </Link>
              <Link href={APP_ROUTES.FESTIVALS} className="p-2.5 bg-gray-50 hover:bg-gray-100 rounded-lg text-gray-700 font-medium text-center border border-gray-200/60 transition-colors">
                🎉 Festivals
              </Link>
              <Link href={APP_ROUTES.PAYMENTS} className="p-2.5 bg-gray-50 hover:bg-gray-100 rounded-lg text-gray-700 font-medium text-center border border-gray-200/60 transition-colors">
                💰 Record Payment
              </Link>
              <Link href={APP_ROUTES.EXPENSES} className="p-2.5 bg-gray-50 hover:bg-gray-100 rounded-lg text-gray-700 font-medium text-center border border-gray-200/60 transition-colors">
                🧾 Record Expense
              </Link>
              <Link href={APP_ROUTES.CALENDAR} className="p-2.5 bg-gray-50 hover:bg-gray-100 rounded-lg text-gray-700 font-medium text-center border border-gray-200/60 transition-colors">
                📅 Calendar
              </Link>
              <Link href={APP_ROUTES.REIMBURSEMENTS} className="p-2.5 bg-gray-50 hover:bg-gray-100 rounded-lg text-gray-700 font-medium text-center border border-gray-200/60 transition-colors">
                👛 Reimbursements
              </Link>
              <Link href={APP_ROUTES.REPORTS} className="col-span-2 p-2.5 bg-primary-50 hover:bg-primary-100 text-primary-800 font-semibold rounded-lg text-center border border-primary-200 transition-colors">
                📊 Financial Reports & Statements
              </Link>
            </div>
          </Card>
        </div>

        {/* Right Column: Recent Payments (2 Cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Recent Payments Table */}
          <Card>
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <Receipt className="w-5 h-5 text-emerald-600" />
                <h2 className="text-lg font-bold text-gray-900">Recent Collections & Payments</h2>
              </div>
              <Link href={APP_ROUTES.PAYMENTS} className="text-primary-600 hover:text-primary-700 text-xs font-semibold hover:underline">
                View All ({stats.recentPayments.length}) →
              </Link>
            </div>

            {stats.recentPayments.length === 0 ? (
              <p className="text-center text-gray-400 py-10 text-xs">No payment records found.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b border-gray-200/80 text-gray-500 font-semibold bg-gray-50/50">
                      <th className="py-2.5 px-3">Family Head</th>
                      <th className="py-2.5 px-3">Festival</th>
                      <th className="py-2.5 px-3">Date</th>
                      <th className="py-2.5 px-3">Amount</th>
                      <th className="py-2.5 px-3 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {stats.recentPayments.slice(0, 6).map((payment) => (
                      <tr key={payment.id} className="hover:bg-gray-50/80 transition-colors">
                        <td className="py-2.5 px-3 font-semibold text-gray-800">{payment.familyName}</td>
                        <td className="py-2.5 px-3 text-gray-600 max-w-[150px] truncate">{payment.festivalName}</td>
                        <td className="py-2.5 px-3 text-gray-500">{formatDate(payment.paidDate)}</td>
                        <td className="py-2.5 px-3 font-bold text-emerald-700">{formatCurrency(payment.amount)}</td>
                        <td className="py-2.5 px-3 text-right">
                          <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                            payment.status === 'PAID'
                              ? 'bg-emerald-100 text-emerald-800'
                              : payment.status === 'PENDING'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-rose-100 text-rose-800'
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

          {/* Recent Account Transactions Ledger */}
          <Card>
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <Wallet className="w-5 h-5 text-sky-600" />
                <h2 className="text-lg font-bold text-gray-900">Recent Cashflow & Ledger</h2>
              </div>
            </div>

            {stats.recentTransactions.length === 0 ? (
              <p className="text-center text-gray-400 py-8 text-xs">No ledger transactions logged yet.</p>
            ) : (
              <div className="space-y-2.5">
                {stats.recentTransactions.slice(0, 5).map((tx) => (
                  <div key={tx.id} className="flex justify-between items-center p-3 bg-gray-50/80 hover:bg-gray-100/70 rounded-xl border border-gray-200/60 transition-colors text-xs">
                    <div className="flex-1 pr-3">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          tx.type === 'INCOME' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                        }`}>
                          {tx.type}
                        </span>
                        <p className="font-semibold text-gray-800 truncate">{tx.description}</p>
                      </div>
                      <p className="text-[11px] text-gray-400 mt-1">{formatDate(tx.date)}</p>
                    </div>

                    <div className="text-right shrink-0">
                      <p className={`font-extrabold text-sm ${tx.type === 'INCOME' ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {tx.type === 'INCOME' ? '+' : '-'}{formatCurrency(tx.amount)}
                      </p>
                      <p className="text-[10px] text-gray-400">Bal: {formatCurrency(tx.balanceAfter)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};
