'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { dashboardController } from '@/controllers/dashboard.controller';
import { reimbursementController } from '@/controllers/reimbursement.controller';
import { DashboardStats, UserAccount } from '@/models';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Loader } from '@/components/ui/Loader';
import { formatCurrency, formatDate } from '@/utils';
import Link from 'next/link';
import { APP_ROUTES } from '@/core/routes';
import { useAuth } from '@/contexts/AuthContext';
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  Calendar, 
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { CartoonDiya } from '@/app/(landing)/components/VillageIllustrations';

export const DashboardView: React.FC = () => {
  const { user, isAdmin } = useAuth();

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [userAccount, setUserAccount] = useState<UserAccount | null>(null);
  const [allUserAccounts, setAllUserAccounts] = useState<UserAccount[]>([]);
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
        ? reimbursementController.getAllUserAccounts()
        : Promise.resolve([]);

      const [data, uAcc, aAccs] = await Promise.all([
        dataPromise,
        userAccPromise,
        adminPromises,
      ]);

      setStats(data);
      setUserAccount(uAcc);
      if (isAdmin) {
        setAllUserAccounts(aAccs || []);
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
        <div className="p-6 text-center space-y-3">
          <AlertCircle className="w-10 h-10 text-red-500 mx-auto" />
          <p className="text-red-700 font-bold text-base">Error Loading Village Dashboard</p>
          <p className="text-xs text-stone-600">{error}</p>
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
        <p className="text-stone-600 text-center py-8 font-medium">No village dashboard data available.</p>
      </Card>
    );
  }

  const currentYear = new Date().getFullYear();
  const netThisYear = stats.totalCollectionThisYear - stats.totalExpenseThisYear;

  const communityTotalPending = allUserAccounts.reduce((sum, acc) => sum + (acc.pendingReimbursement || 0), 0);
  const communityTotalSpent = allUserAccounts.reduce((sum, acc) => sum + (acc.totalPaidOutOfPocket || 0), 0);
  const communityTotalReimbursed = allUserAccounts.reduce((sum, acc) => sum + (acc.totalReimbursed || 0), 0);

  return (
    <div className="space-y-6 pb-8">
      
      {/* 🪔 Daily Village Blessing & Quote Banner */}
      <div className="bg-gradient-to-r from-amber-100 via-orange-50 to-emerald-50 p-4 sm:p-5 rounded-3xl border-2 border-amber-300 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <CartoonDiya size={42} />
          <div>
            <p className="text-xs font-black text-amber-900 flex items-center gap-1.5">
              <span>🌾 Luhuren Gram Sandesh • {currentYear}</span>
              <span className="text-[10px] px-2 py-0.2 rounded-full bg-amber-200/80 text-amber-950 font-bold">Auspicious</span>
            </p>
            <p className="text-xs sm:text-sm text-stone-700 font-semibold italic mt-0.5">
              &ldquo;Mili-juli chanda se khilta gaon, parivaar ka prem hi mandap ki shaan.&rdquo;
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            size="sm"
            variant="outline"
            onClick={() => loadData(true)}
            isLoading={refreshing}
            disabled={refreshing}
            className="flex items-center gap-1.5 text-xs font-bold rounded-2xl border-2 border-amber-300 bg-white"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-orange-600 ${refreshing ? 'animate-spin' : ''}`} />
            <span>Refresh Hisab</span>
          </Button>
        </div>
      </div>

      {/* Primary Village Treasury Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        
        {/* 1. Master Account Gullak Balance */}
        <div className="bg-white rounded-3xl p-5 border-2 border-amber-300 shadow-sm hover:shadow-md transition-all space-y-2 relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-amber-800">
              🏺 TREASURY GULLAK
            </span>
            <div className="w-10 h-10 rounded-2xl bg-amber-100 border border-amber-300 flex items-center justify-center text-lg shadow-xs group-hover:scale-110 transition-transform">
              🏺
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
            {formatCurrency(stats.currentBalance)}
          </p>
          <div className="flex items-center justify-between text-[11px] font-bold text-stone-500 pt-1 border-t border-amber-100">
            <span>Central Mandap Cash</span>
            <span className={netThisYear >= 0 ? 'text-emerald-700' : 'text-orange-700'}>
              Net {netThisYear >= 0 ? '+' : ''}{formatCurrency(netThisYear)}
            </span>
          </div>
        </div>

        {/* 2. Total Chanda Collections */}
        <div className="bg-white rounded-3xl p-5 border-2 border-emerald-300 shadow-sm hover:shadow-md transition-all space-y-2 relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800">
              📜 CHANDA SANGRAH
            </span>
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 border border-emerald-300 flex items-center justify-center text-lg shadow-xs group-hover:scale-110 transition-transform">
              🪔
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-emerald-800 tracking-tight">
            {formatCurrency(stats.totalCollectionThisYear)}
          </p>
          <div className="flex items-center justify-between text-[11px] font-bold text-stone-500 pt-1 border-t border-emerald-100">
            <span>{currentYear} Puja Subscriptions</span>
            <span className="text-emerald-700 flex items-center gap-0.5">
              <ArrowUpRight className="w-3.5 h-3.5" /> 100% Verified
            </span>
          </div>
        </div>

        {/* 3. Total Festival Expenses */}
        <div className="bg-white rounded-3xl p-5 border-2 border-orange-300 shadow-sm hover:shadow-md transition-all space-y-2 relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-orange-800">
              🧾 KHARCHA BAHI-KHATA
            </span>
            <div className="w-10 h-10 rounded-2xl bg-orange-100 border border-orange-300 flex items-center justify-center text-lg shadow-xs group-hover:scale-110 transition-transform">
              📜
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-orange-900 tracking-tight">
            {formatCurrency(stats.totalExpenseThisYear)}
          </p>
          <div className="flex items-center justify-between text-[11px] font-bold text-stone-500 pt-1 border-t border-orange-100">
            <span>Tent, Sound &amp; Prasad</span>
            <span className="text-orange-700 flex items-center gap-0.5">
              <ArrowDownRight className="w-3.5 h-3.5" /> Disbursed
            </span>
          </div>
        </div>

        {/* 4. Village Families Registered */}
        <div className="bg-white rounded-3xl p-5 border-2 border-yellow-300 shadow-sm hover:shadow-md transition-all space-y-2 relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-amber-800">
              🏡 GRAM PARIVAR
            </span>
            <div className="w-10 h-10 rounded-2xl bg-yellow-100 border border-yellow-300 flex items-center justify-center text-lg shadow-xs group-hover:scale-110 transition-transform">
              🌾
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
            {stats.totalFamilies} Parivar
          </p>
          <div className="flex items-center justify-between text-[11px] font-bold text-stone-500 pt-1 border-t border-yellow-100">
            <span>Active Households</span>
            <span className="text-amber-800 font-bold">{stats.activeFestivalsCount} Pujas Active</span>
          </div>
        </div>

      </div>

      {/* Admin Quick Audit Strip (for Committee Admins) */}
      {isAdmin && (
        <div className="bg-gradient-to-r from-stone-900 to-stone-950 text-white p-5 rounded-3xl border-2 border-amber-400/40 shadow-xl space-y-3">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-400 text-stone-950 flex items-center justify-center font-black text-sm">
                🛡️
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-black text-white">Admin &amp; Committee Master Overview</h3>
                <p className="text-[11px] text-amber-300">Live community out-of-pocket claims &amp; pending disbursements</p>
              </div>
            </div>
            
            <Link href={APP_ROUTES.REIMBURSEMENTS}>
              <span className="text-xs text-amber-300 hover:text-amber-200 font-bold underline">
                Open Reimbursements Hub →
              </span>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="p-3 bg-stone-800/80 rounded-2xl border border-stone-700">
              <p className="text-[10px] text-stone-400 font-bold uppercase">TOTAL OUT-OF-POCKET SPENT</p>
              <p className="text-lg font-black text-white mt-0.5">{formatCurrency(communityTotalSpent)}</p>
            </div>
            <div className="p-3 bg-stone-800/80 rounded-2xl border border-stone-700">
              <p className="text-[10px] text-stone-400 font-bold uppercase">TOTAL REIMBURSED BACK</p>
              <p className="text-lg font-black text-emerald-400 mt-0.5">{formatCurrency(communityTotalReimbursed)}</p>
            </div>
            <div className="p-3 bg-stone-800/80 rounded-2xl border border-stone-700">
              <p className="text-[10px] text-amber-300 font-bold uppercase">PENDING MEMBER CLAIMS</p>
              <p className="text-lg font-black text-amber-400 mt-0.5">{formatCurrency(communityTotalPending)}</p>
            </div>
          </div>
        </div>
      )}

      {/* Main Content 2-Column Grid */}
      <div className="grid lg:grid-cols-12 gap-6">
        
        {/* Left Column: Upcoming Utsav & Pujas (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white rounded-3xl p-5 sm:p-6 border-2 border-amber-200 shadow-sm space-y-4">
            
            <div className="flex items-center justify-between pb-3 border-b-2 border-amber-100">
              <div className="flex items-center gap-2">
                <span className="text-xl">🪔</span>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-stone-900">Upcoming Utsav &amp; Pujas</h3>
                  <p className="text-xs text-stone-500 font-medium">Scheduled festivals and community collection targets</p>
                </div>
              </div>
              <Link href={APP_ROUTES.FESTIVALS} className="text-xs font-bold text-orange-700 hover:text-orange-800 underline">
                View All Pujas →
              </Link>
            </div>

            {stats.upcomingFestivalsList.length === 0 ? (
              <div className="text-center py-10 bg-amber-50/50 rounded-2xl border-2 border-dashed border-amber-200 space-y-2">
                <Calendar className="w-8 h-8 text-amber-400 mx-auto" />
                <p className="text-xs text-stone-600 font-bold">No upcoming festivals scheduled.</p>
                {isAdmin && (
                  <Link href={APP_ROUTES.FESTIVAL_CREATE} className="text-xs font-black text-orange-700 hover:underline inline-block">
                    + Schedule a new puja
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
                      <div className="p-4 bg-amber-50/40 hover:bg-amber-100/60 border-2 border-amber-200 rounded-2xl transition-all duration-150 group">
                        <div className="flex justify-between items-start gap-2">
                          <div>
                            <h4 className="text-sm font-black text-stone-900 group-hover:text-orange-700 transition-colors flex items-center gap-1.5">
                              <span>🪔</span>
                              <span>{festival.name}</span>
                            </h4>
                            <div className="flex items-center gap-2 text-xs text-stone-600 mt-1 font-medium">
                              <Calendar className="w-3.5 h-3.5 text-amber-700" />
                              <span>{formatDate(festival.date)}</span>
                              {isMultiDay && (
                                <span className="text-[10px] bg-amber-100 text-amber-900 px-2 py-0.2 rounded-full font-bold border border-amber-300">
                                  {diffDays} Days Utsav
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="text-xs font-bold text-stone-500">Per Family</span>
                            <p className="text-sm font-black text-emerald-800">{formatCurrency(festival.amountPerFamily)}</p>
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Quick Village Actions & Out-of-Pocket Ledger (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Out-of-Pocket Personal Pocket Card */}
          <div className="bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100/70 rounded-3xl p-5 sm:p-6 border-2 border-amber-300 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-900">
                👛 APNA KISAN LEDGER
              </span>
              <span className="text-xs font-bold text-amber-800 bg-white/80 px-2.5 py-0.5 rounded-full border border-amber-300">
                Claimable
              </span>
            </div>
            
            <div>
              <p className="text-xs text-stone-600 font-medium">Out-of-Pocket Balance Pending Reimbursement:</p>
              <p className="text-2xl sm:text-3xl font-black text-orange-950 mt-0.5">
                {formatCurrency(userAccount?.pendingReimbursement || 0)}
              </p>
            </div>

            <div className="pt-2 border-t border-amber-200/80 flex items-center justify-between">
              <Link href={APP_ROUTES.EXPENSE_RECORD} className="flex-1">
                <Button size="sm" className="w-full text-xs font-bold rounded-xl bg-orange-600 hover:bg-orange-700 text-white">
                  + Log Out-of-Pocket
                </Button>
              </Link>
              <Link href={APP_ROUTES.REIMBURSEMENTS} className="flex-1 ml-2">
                <Button size="sm" variant="outline" className="w-full text-xs font-bold rounded-xl border-2 border-amber-300 bg-white">
                  Claim Payout →
                </Button>
              </Link>
            </div>
          </div>

          {/* Quick Village Action Shortcuts */}
          <div className="bg-white rounded-3xl p-5 border-2 border-amber-200 shadow-sm space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-stone-700">Quick Village Actions</h4>
            
            <div className="grid grid-cols-2 gap-2 text-xs font-bold">
              <Link href={APP_ROUTES.PAYMENT_RECORD}>
                <div className="p-3 rounded-2xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-950 flex items-center gap-2 transition-all">
                  <span className="text-base">📜</span>
                  <span>Record Chanda</span>
                </div>
              </Link>
              
              <Link href={APP_ROUTES.EXPENSE_RECORD}>
                <div className="p-3 rounded-2xl bg-orange-50 hover:bg-orange-100 border border-orange-200 text-orange-950 flex items-center gap-2 transition-all">
                  <span className="text-base">🏺</span>
                  <span>Record Expense</span>
                </div>
              </Link>

              <Link href={APP_ROUTES.FAMILIES}>
                <div className="p-3 rounded-2xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-950 flex items-center gap-2 transition-all">
                  <span className="text-base">🏡</span>
                  <span>Parivar List</span>
                </div>
              </Link>

              <Link href={APP_ROUTES.CALENDAR}>
                <div className="p-3 rounded-2xl bg-yellow-50 hover:bg-yellow-100 border border-yellow-200 text-yellow-950 flex items-center gap-2 transition-all">
                  <span className="text-base">📅</span>
                  <span>Utsav Dates</span>
                </div>
              </Link>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
