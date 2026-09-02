'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { dashboardController } from '@/controllers/dashboard.controller';
import { reimbursementController } from '@/controllers/reimbursement.controller';
import { DashboardStats, UserAccount, ReimbursementRequest } from '@/models';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Loader } from '@/components/ui/Loader';
import { formatCurrency, formatDate } from '@/utils';
import Link from 'next/link';
import { APP_ROUTES } from '@/core/routes';
import { useAuth } from '@/contexts/AuthContext';
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
  FileText,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const { user, isAdmin } = useAuth();

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [userAccount, setUserAccount] = useState<UserAccount | null>(null);
  const [allUserAccounts, setAllUserAccounts] = useState<UserAccount[]>([]);
  const [pendingClaims, setPendingClaims] = useState<ReimbursementRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const loadData = useCallback(async (isManualRefresh = false) => {
    if (isManualRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const dataPromise = dashboardController.getStats();
      const userAccPromise = user?.id 
        ? reimbursementController.getUserAccount(user.id, user.name, user.email)
        : Promise.resolve(null);
      
      const adminPromises = isAdmin
        ? Promise.all([
            reimbursementController.getAllUserAccounts(),
            reimbursementController.getAllClaims(),
          ])
        : Promise.resolve([[], []]);

      const [data, uAcc, [aAccs, aClaims]] = await Promise.all([
        dataPromise,
        userAccPromise,
        adminPromises,
      ]);

      setStats(data);
      setUserAccount(uAcc);
      if (isAdmin) {
        setAllUserAccounts(aAccs || []);
        setPendingClaims((aClaims || []).filter(c => c.status === 'PENDING'));
      }
      setError('');
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to load dashboard data';
      setError(errorMessage);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user?.id, user?.name, user?.email, isAdmin]);

  useEffect(() => {
    loadData();
  }, [loadData]);

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
          <Button onClick={() => loadData(true)} className="mx-auto">
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

  // Community Reimbursement totals
  const communityTotalPending = allUserAccounts.reduce((sum, acc) => sum + (acc.pendingReimbursement || 0), 0);
  const communityTotalSpent = allUserAccounts.reduce((sum, acc) => sum + (acc.totalPaidOutOfPocket || 0), 0);
  const communityTotalReimbursed = allUserAccounts.reduce((sum, acc) => sum + (acc.totalReimbursed || 0), 0);

  return (
    <div className="space-y-6">
      {/* Top Header & Quick Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">Financial & Community Dashboard</h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">Real-time overview for {currentYear} festivals, collections, expenses & reimbursements</p>
        </div>

        <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto">
          <Button
            size="sm"
            variant="outline"
            onClick={() => loadData(true)}
            isLoading={refreshing}
            disabled={refreshing}
            className="flex items-center gap-1.5 text-xs text-gray-700 hover:bg-gray-50 border-gray-300"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>

          <Link href={APP_ROUTES.PAYMENTS}>
            <Button size="sm" className="flex items-center gap-1.5 text-xs bg-primary-600 hover:bg-primary-700 shadow-xs">
              <PlusCircle className="w-3.5 h-3.5" />
              Record Payment
            </Button>
          </Link>

          <Link href={APP_ROUTES.EXPENSES}>
            <Button size="sm" variant="secondary" className="flex items-center gap-1.5 text-xs shadow-xs">
              <ArrowDownRight className="w-3.5 h-3.5" />
              Record Expense
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
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Available Master Balance</p>
              <p className={`text-2xl sm:text-3xl font-extrabold mt-1 tracking-tight ${
                stats.currentBalance >= 0 ? 'text-primary-700' : 'text-red-600'
              }`}>
                {formatCurrency(stats.currentBalance)}
              </p>
              <p className="text-[11px] text-gray-400 mt-1 flex items-center gap-1">
                <Wallet className="w-3 h-3 text-gray-400" />
                Live Treasury Account
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

      {/* Reimbursement & Out-of-Pocket Flow Panel */}
      <Card className="border border-amber-200/90 bg-gradient-to-r from-amber-50/50 via-white to-amber-50/30">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-amber-100 text-amber-800 rounded-xl">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900">
                {isAdmin ? 'Community Reimbursements & Out-of-Pocket Flow' : 'My Personal Reimbursement Ledger'}
              </h2>
              <p className="text-xs text-gray-500">
                {isAdmin 
                  ? 'Track total out-of-pocket vendor spending by members and settlement liability'
                  : 'Track your personal out-of-pocket expenses and claim status'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link href={APP_ROUTES.REIMBURSEMENTS}>
              <Button size="sm" variant="outline" className="text-xs border-amber-300 text-amber-900 hover:bg-amber-50">
                Open Reimbursements Hub →
              </Button>
            </Link>
          </div>
        </div>

        {isAdmin ? (
          <div className="pt-4 space-y-4">
            {/* Admin: Community Totals Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="p-3.5 bg-white border border-amber-200/80 rounded-xl shadow-2xs">
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Total Pending Owed to Members</p>
                <p className="text-xl sm:text-2xl font-black text-amber-600 mt-1">
                  {formatCurrency(communityTotalPending)}
                </p>
                <p className="text-[10px] text-gray-400 mt-0.5">
                  Current club reimbursement liability
                </p>
              </div>

              <div className="p-3.5 bg-white border border-primary-200/80 rounded-xl shadow-2xs">
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Total Member Out-of-Pocket</p>
                <p className="text-xl sm:text-2xl font-black text-primary-700 mt-1">
                  {formatCurrency(communityTotalSpent)}
                </p>
                <p className="text-[10px] text-gray-400 mt-0.5">
                  Spent across all member ledgers
                </p>
              </div>

              <div className="p-3.5 bg-white border border-emerald-200/80 rounded-xl shadow-2xs">
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Total Settled & Reimbursed</p>
                <p className="text-xl sm:text-2xl font-black text-emerald-600 mt-1">
                  {formatCurrency(communityTotalReimbursed)}
                </p>
                <p className="text-[10px] text-gray-400 mt-0.5">
                  Disbursed back from treasury
                </p>
              </div>

              <div className="p-3.5 bg-white border border-sky-200/80 rounded-xl shadow-2xs">
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Pending Claims in Queue</p>
                <p className="text-xl sm:text-2xl font-black text-sky-700 mt-1">
                  {pendingClaims.length}
                </p>
                <p className="text-[10px] text-gray-400 mt-0.5">
                  Claims awaiting Admin approval
                </p>
              </div>
            </div>

            {/* Admin: Personal Summary Strip */}
            <div className="p-3 bg-gray-50/90 border border-gray-200/70 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-xs">
              <span className="font-semibold text-gray-700 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Admin Personal Ledger ({user?.name || 'Admin'}):
              </span>
              <div className="flex items-center gap-4 text-[11px] text-gray-600 flex-wrap">
                <span>My Out-of-Pocket: <strong className="text-primary-700">{formatCurrency(userAccount?.totalPaidOutOfPocket || 0)}</strong></span>
                <span>My Pending Claim: <strong className="text-amber-600">{formatCurrency(userAccount?.pendingReimbursement || 0)}</strong></span>
                <span>Total Reimbursed to Me: <strong className="text-emerald-600">{formatCurrency(userAccount?.totalReimbursed || 0)}</strong></span>
              </div>
            </div>
          </div>
        ) : (
          /* Member: Personal Cards */
          <div className="pt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 bg-white border border-amber-200 rounded-xl shadow-2xs">
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">My Pending Reimbursement</p>
              <p className="text-xl sm:text-2xl font-black text-amber-600 mt-1">
                {formatCurrency(userAccount?.pendingReimbursement || 0)}
              </p>
              <p className="text-[10px] text-gray-400 mt-0.5">Claimable upon admin approval</p>
            </div>

            <div className="p-3.5 bg-white border border-primary-200 rounded-xl shadow-2xs">
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">My Total Out-of-Pocket</p>
              <p className="text-xl sm:text-2xl font-black text-primary-700 mt-1">
                {formatCurrency(userAccount?.totalPaidOutOfPocket || 0)}
              </p>
              <p className="text-[10px] text-gray-400 mt-0.5">Bills paid from personal money</p>
            </div>

            <div className="p-3.5 bg-white border border-emerald-200 rounded-xl shadow-2xs">
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Total Reimbursed</p>
              <p className="text-xl sm:text-2xl font-black text-emerald-600 mt-1">
                {formatCurrency(userAccount?.totalReimbursed || 0)}
              </p>
              <p className="text-[10px] text-gray-400 mt-0.5">Settled & paid back by club</p>
            </div>
          </div>
        )}
      </Card>

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
                {isAdmin && (
                  <Link href={APP_ROUTES.FESTIVAL_CREATE} className="text-xs text-primary-600 font-semibold mt-2 inline-block hover:underline">
                    + Schedule a festival
                  </Link>
                )}
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
                            {formatCurrency(festival.amountPerFamily)}/family
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                          <Clock className="w-3.5 h-3.5 text-gray-400" />
                          <span>{formatDate(festival.date)}</span>
                          {isMultiDay && festival.endDate && (
                            <span className="px-1.5 py-0.5 bg-primary-100 text-primary-700 rounded text-[10px] font-medium">
                              {diffDays} days
                            </span>
                          )}
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </Card>

          {/* Quick Navigation Box */}
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
        <div className="lg:col-span-2">
          <Card>
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <Receipt className="w-5 h-5 text-emerald-600" />
                <h2 className="text-lg font-bold text-gray-900">Recent Collections & Contributions</h2>
              </div>
              <Link href={APP_ROUTES.PAYMENTS} className="text-primary-600 hover:text-primary-700 text-xs font-semibold hover:underline">
                View All Payments →
              </Link>
            </div>

            {stats.recentPayments.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                <Receipt className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-600">No payment records yet.</p>
                <p className="text-xs text-gray-400 mt-1">Start by recording family contribution payments.</p>
                <Link href={APP_ROUTES.PAYMENT_RECORD} className="mt-3 inline-block">
                  <Button size="sm" className="text-xs">
                    + Record First Payment
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b border-gray-200 text-gray-500 font-semibold bg-gray-50/50">
                      <th className="py-2.5 px-3">Date</th>
                      <th className="py-2.5 px-3">Family Head</th>
                      <th className="py-2.5 px-3">Festival</th>
                      <th className="py-2.5 px-3">Amount</th>
                      <th className="py-2.5 px-3">Status</th>
                      <th className="py-2.5 px-3">Receipt #</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {stats.recentPayments.map((payment) => (
                      <tr key={payment.id} className="hover:bg-gray-50/80 transition-colors">
                        <td className="py-3 px-3 text-gray-500">{formatDate(payment.paidDate)}</td>
                        <td className="py-3 px-3 font-semibold text-gray-900">{payment.familyName}</td>
                        <td className="py-3 px-3 text-gray-600">{payment.festivalName}</td>
                        <td className="py-3 px-3 font-bold text-emerald-600 text-sm">
                          {formatCurrency(payment.amount)}
                        </td>
                        <td className="py-3 px-3">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                            payment.status === 'PAID'
                              ? 'bg-emerald-100 text-emerald-800'
                              : payment.status === 'PENDING'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}>
                            {payment.status === 'PAID' && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                            {payment.status}
                          </span>
                        </td>
                        <td className="py-3 px-3 font-mono text-[11px] text-gray-500">
                          {payment.receiptNumber || '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};
