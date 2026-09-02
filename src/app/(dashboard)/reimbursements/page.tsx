'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { reimbursementController } from '@/controllers/reimbursement.controller';
import { festivalController } from '@/controllers/festival.controller';
import { expenseController } from '@/controllers/expense.controller';
import { ReimbursementRequest, UserAccount, Festival, Expense } from '@/models';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Loader } from '@/components/ui/Loader';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { formatCurrency, formatDate } from '@/utils';
import { generateReimbursementVoucherPDF } from '@/utils/pdf';
import { APP_ROUTES } from '@/core/routes';
import { 
  Wallet, 
  TrendingUp, 
  CheckCircle, 
  Clock, 
  XCircle, 
  PlusCircle, 
  Download, 
  ShieldCheck, 
  AlertCircle,
  RefreshCw,
  Users,
  Receipt,
  Landmark
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export default function ReimbursementsPage() {
  const { user, isAdmin } = useAuth();
  const { toast } = useToast();

  const [userAccount, setUserAccount] = useState<UserAccount | null>(null);
  const [allUserAccounts, setAllUserAccounts] = useState<UserAccount[]>([]);
  const [myClaims, setMyClaims] = useState<ReimbursementRequest[]>([]);
  const [allClaims, setAllClaims] = useState<ReimbursementRequest[]>([]);
  const [pendingExpenses, setPendingExpenses] = useState<Expense[]>([]);
  const [festivals, setFestivals] = useState<Festival[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Modal state
  const [showClaimModal, setShowClaimModal] = useState(false);
  const [claimAmount, setClaimAmount] = useState<number>(0);
  const [claimFestivalId, setClaimFestivalId] = useState('');
  const [claimNotes, setClaimNotes] = useState('');
  const [claimPayoutDetails, setClaimPayoutDetails] = useState('');
  const [submittingClaim, setSubmittingClaim] = useState(false);

  // Action states
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'MY_CLAIMS' | 'ADMIN_APPROVALS' | 'MEMBER_BALANCES'>('MY_CLAIMS');

  const loadData = useCallback(async (isManual = false) => {
    if (isManual) setRefreshing(true);
    else setLoading(true);

    try {
      if (!user?.id) {
        setLoading(false);
        setRefreshing(false);
        return;
      }

      const [uAcc, mClaims, festList] = await Promise.all([
        reimbursementController.getUserAccount(user.id, user.name, user.email),
        reimbursementController.getMyClaims(user.id),
        festivalController.getAllFestivals(),
      ]);

      setUserAccount(uAcc);
      setMyClaims(mClaims || []);
      setFestivals(festList || []);

      if (isAdmin) {
        const [aClaims, aAccs, allExpenses] = await Promise.all([
          reimbursementController.getAllClaims(),
          reimbursementController.getAllUserAccounts(),
          expenseController.getAllExpenses(),
        ]);
        setAllClaims(aClaims || []);
        setAllUserAccounts(aAccs || []);
        setPendingExpenses(allExpenses.filter(e => e.approvalStatus === 'PENDING_APPROVAL'));
      }
    } catch (err) {
      console.error('Failed to load reimbursement data:', err);
      if (isManual) {
        toast.error('Failed to load reimbursement details', 'Loading Error');
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user?.id, user?.name, user?.email, isAdmin]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleOpenClaimModal = () => {
    if (userAccount && userAccount.pendingReimbursement > 0) {
      setClaimAmount(userAccount.pendingReimbursement);
    } else {
      setClaimAmount(0);
    }
    setClaimNotes('');
    setClaimPayoutDetails('');
    setShowClaimModal(true);
  };

  const handleCreateClaim = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;

    if (claimAmount <= 0) {
      toast.warning('Please enter an amount greater than ₹0.', 'Invalid Amount');
      return;
    }

    setSubmittingClaim(true);
    try {
      const fest = festivals.find(f => f.id === claimFestivalId);
      await reimbursementController.createClaim({
        userId: user.id,
        userName: user.name || 'Member',
        userEmail: user.email || '',
        amount: claimAmount,
        festivalId: claimFestivalId || undefined,
        festivalName: fest?.name,
        notes: claimNotes,
        payoutDetails: claimPayoutDetails,
      });

      toast.success(
        `Reimbursement request for ${formatCurrency(claimAmount)} submitted successfully! Admins have been notified.`, 
        'Claim Submitted'
      );
      setShowClaimModal(false);
      await loadData(true);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to submit claim';
      toast.error(msg, 'Submission Failed');
    } finally {
      setSubmittingClaim(false);
    }
  };

  const handleApproveClaim = async (claim: ReimbursementRequest) => {
    if (!user?.id) return;

    const confirmPay = window.confirm(
      `Approve & Pay ₹${claim.amount.toLocaleString('en-IN')} to ${claim.userName}?\n\n` +
      `This will:\n1. Deduct ₹${claim.amount.toLocaleString('en-IN')} from the Master Account\n2. Settle ${claim.userName}'s pending balance\n3. Generate an official Payout Voucher Receipt`
    );

    if (!confirmPay) return;

    setProcessingId(claim.id);
    try {
      const { pdfBlob, receiptNumber } = await reimbursementController.approveClaim(claim.id, {
        id: user.id,
        name: user.name || 'Admin',
      });

      // Automatically download voucher
      const url = URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${receiptNumber}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success(
        `Claim approved! ₹${claim.amount.toLocaleString('en-IN')} disbursed from Master Account. Voucher ${receiptNumber} downloaded.`,
        'Payout Approved & Settled'
      );
      await loadData(true);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to approve claim';
      toast.error(msg, 'Approval Error');
    } finally {
      setProcessingId(null);
    }
  };

  const handleRejectClaim = async (claim: ReimbursementRequest) => {
    if (!user?.id) return;

    const reason = window.prompt(`Please enter the rejection reason for ${claim.userName}'s claim:`);
    if (reason === null) return;

    setProcessingId(claim.id);
    try {
      await reimbursementController.rejectClaim(claim.id, {
        id: user.id,
        name: user.name || 'Admin',
      }, reason || 'Rejected by administrator');

      toast.info(`Claim for ${claim.userName} was marked as Rejected.`, 'Claim Rejected');
      await loadData(true);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to reject claim';
      toast.error(msg, 'Rejection Error');
    } finally {
      setProcessingId(null);
    }
  };

  const handleApproveExpense = async (expense: Expense) => {
    if (!user?.id) return;

    const confirmApprove = window.confirm(
      `Approve Master Account payment for ₹${expense.amount.toLocaleString('en-IN')} (${expense.purpose})?\n\n` +
      `This will deduct ₹${expense.amount.toLocaleString('en-IN')} from the Club Master Account.`
    );

    if (!confirmApprove) return;

    setProcessingId(expense.id);
    try {
      await expenseController.approveMasterAccountExpense(expense.id, {
        id: user.id,
        name: user.name || 'Admin',
      });

      toast.success(
        `Expense approved! ₹${expense.amount.toLocaleString('en-IN')} deducted from Master Account.`,
        'Master Account Deducted'
      );
      await loadData(true);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to approve expense';
      toast.error(msg, 'Approval Error');
    } finally {
      setProcessingId(null);
    }
  };

  const handleRejectExpense = async (expense: Expense) => {
    if (!user?.id) return;

    const reason = window.prompt(`Please enter the rejection reason for this expense:`);
    if (reason === null) return;

    setProcessingId(expense.id);
    try {
      await expenseController.rejectMasterAccountExpense(expense.id, {
        id: user.id,
        name: user.name || 'Admin',
      }, reason || 'Rejected by administrator');

      toast.info(`Expense request was rejected.`, 'Expense Rejected');
      await loadData(true);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to reject expense';
      toast.error(msg, 'Rejection Error');
    } finally {
      setProcessingId(null);
    }
  };

  const downloadExistingVoucher = (claim: ReimbursementRequest) => {
    if (!claim.receiptNumber) {
      toast.warning('No receipt voucher recorded for this claim.', 'Voucher Unavailable');
      return;
    }

    const pdfBlob = generateReimbursementVoucherPDF({
      voucherNumber: claim.receiptNumber,
      beneficiaryName: claim.userName,
      beneficiaryEmail: claim.userEmail,
      amount: claim.amount,
      approvedDate: claim.approvedAt || claim.updatedAt || new Date(),
      approvedByName: claim.approvedByName || 'Club Administrator',
      festivalName: claim.festivalName,
      notes: claim.notes,
      payoutDetails: claim.payoutDetails,
    });

    const url = URL.createObjectURL(pdfBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${claim.receiptNumber}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success(`Voucher ${claim.receiptNumber} downloaded.`, 'Receipt Downloaded');
  };

  if (loading && !userAccount) {
    return (
      <div className="flex justify-center items-center py-24">
        <Loader size="lg" />
      </div>
    );
  }

  const pendingAdminClaims = allClaims.filter(c => c.status === 'PENDING');
  const totalPendingActionItems = pendingAdminClaims.length + pendingExpenses.length;
  const totalPendingPayouts = pendingAdminClaims.reduce((sum, c) => sum + c.amount, 0) + 
                             pendingExpenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-3xl border-2 border-amber-200 shadow-sm">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight flex items-center gap-2">
            <span>👛</span>
            <span>Apna Kisan Reimbursements &amp; Claims Hub</span>
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 font-medium mt-0.5">
            Manage out-of-pocket vendor payments, money requests, and treasury settlements
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap w-full sm:w-auto">
          <Button
            size="sm"
            variant="outline"
            onClick={() => loadData(true)}
            isLoading={refreshing}
            disabled={refreshing}
            className="flex items-center gap-1.5 text-xs font-bold rounded-2xl border-2 border-amber-300 bg-white hover:bg-amber-50 text-stone-700"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-orange-600 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>

          {/* Direct link for User to pay/record vendor expense */}
          <Link href={APP_ROUTES.EXPENSE_RECORD}>
            <Button
              size="sm"
              variant="outline"
              className="flex items-center gap-1.5 text-xs text-orange-800 bg-amber-50 hover:bg-amber-100 border-2 border-amber-300 font-bold rounded-2xl"
            >
              <Receipt className="w-3.5 h-3.5 text-orange-600" />
              + Record Vendor Bill
            </Button>
          </Link>

          <Button
            size="sm"
            onClick={handleOpenClaimModal}
            className="flex items-center gap-1.5 text-xs font-black rounded-2xl bg-orange-600 hover:bg-orange-700 text-white shadow-sm border border-amber-200"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            + Raise Money Request
          </Button>
        </div>
      </div>

      {/* Metrics Section: Club-Wide for Admin, Personal for Member */}
      {isAdmin ? (
        <div className="space-y-4">
          {/* Section 1: Club-Wide Community Reimbursement Totals */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
                <Users className="w-4 h-4 text-primary-600" />
                Club-Wide Community Reimbursement Flow (All Members)
              </h2>
              <span className="text-[11px] font-semibold text-primary-700 bg-primary-50 border border-primary-200 px-2 py-0.5 rounded-full">
                {allUserAccounts.length} Member Ledgers
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="border-l-4 border-l-amber-500 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Pending Reimbursement</p>
                    <p className="text-2xl sm:text-3xl font-black text-amber-600 mt-1">
                      {formatCurrency(allUserAccounts.reduce((sum, acc) => sum + (acc.pendingReimbursement || 0), 0))}
                    </p>
                    <p className="text-[11px] text-gray-400 mt-1">
                      Total owed by club to members
                    </p>
                  </div>
                  <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl">
                    <Clock className="w-5 h-5" />
                  </div>
                </div>
              </Card>

              <Card className="border-l-4 border-l-primary-500 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Out-of-Pocket Spent</p>
                    <p className="text-2xl sm:text-3xl font-black text-primary-700 mt-1">
                      {formatCurrency(allUserAccounts.reduce((sum, acc) => sum + (acc.totalPaidOutOfPocket || 0), 0))}
                    </p>
                    <p className="text-[11px] text-gray-400 mt-1">
                      Total paid by all members from pocket
                    </p>
                  </div>
                  <div className="p-2.5 bg-primary-50 text-primary-600 rounded-xl">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                </div>
              </Card>

              <Card className="border-l-4 border-l-emerald-500 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Reimbursed</p>
                    <p className="text-2xl sm:text-3xl font-black text-emerald-600 mt-1">
                      {formatCurrency(allUserAccounts.reduce((sum, acc) => sum + (acc.totalReimbursed || 0), 0))}
                    </p>
                    <p className="text-[11px] text-gray-400 mt-1">
                      Total settled & disbursed from treasury
                    </p>
                  </div>
                  <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
                    <CheckCircle className="w-5 h-5" />
                  </div>
                </div>
              </Card>

              <Card className="border-l-4 border-l-sky-500 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Pending Action Items</p>
                    <p className="text-2xl sm:text-3xl font-black text-sky-700 mt-1">
                      {totalPendingActionItems}
                    </p>
                    <p className="text-[11px] text-gray-400 mt-1">
                      {pendingAdminClaims.length} Claims • {pendingExpenses.length} Expense Requests
                    </p>
                  </div>
                  <div className="p-2.5 bg-sky-50 text-sky-600 rounded-xl">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* Section 2: Admin's Personal Account Balance */}
          <div className="p-4 bg-gray-50/80 border border-gray-200/80 rounded-2xl">
            <div className="flex items-center justify-between mb-2.5">
              <p className="text-xs font-bold text-gray-600 uppercase tracking-wider flex items-center gap-1.5">
                <Wallet className="w-3.5 h-3.5 text-gray-500" />
                My Personal Out-of-Pocket Ledger ({user?.name || 'Admin'})
              </p>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-200 text-gray-700">
                Personal Account
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-white border border-gray-200 rounded-xl flex justify-between items-center">
                <div>
                  <p className="text-gray-400 text-[11px] font-medium">My Pending Reimbursement</p>
                  <p className="text-lg font-black text-amber-600 mt-0.5">{formatCurrency(userAccount?.pendingReimbursement || 0)}</p>
                </div>
                <Clock className="w-4 h-4 text-amber-500" />
              </div>
              <div className="p-3 bg-white border border-gray-200 rounded-xl flex justify-between items-center">
                <div>
                  <p className="text-gray-400 text-[11px] font-medium">My Total Out-of-Pocket</p>
                  <p className="text-lg font-black text-primary-700 mt-0.5">{formatCurrency(userAccount?.totalPaidOutOfPocket || 0)}</p>
                </div>
                <TrendingUp className="w-4 h-4 text-primary-500" />
              </div>
              <div className="p-3 bg-white border border-gray-200 rounded-xl flex justify-between items-center">
                <div>
                  <p className="text-gray-400 text-[11px] font-medium">Total Reimbursed to Me</p>
                  <p className="text-lg font-black text-emerald-600 mt-0.5">{formatCurrency(userAccount?.totalReimbursed || 0)}</p>
                </div>
                <CheckCircle className="w-4 h-4 text-emerald-500" />
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Regular Member Personal Account Balance Cards */
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="border-l-4 border-l-amber-500 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">My Pending Reimbursement</p>
                <p className="text-2xl sm:text-3xl font-black text-amber-600 mt-1">
                  {formatCurrency(userAccount?.pendingReimbursement || 0)}
                </p>
                <p className="text-[11px] text-gray-400 mt-1">
                  Amount currently claimable from club
                </p>
              </div>
              <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl">
                <Clock className="w-5 h-5" />
              </div>
            </div>
          </Card>

          <Card className="border-l-4 border-l-primary-500 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">My Total Out-of-Pocket</p>
                <p className="text-2xl sm:text-3xl font-black text-primary-700 mt-1">
                  {formatCurrency(userAccount?.totalPaidOutOfPocket || 0)}
                </p>
                <p className="text-[11px] text-gray-400 mt-1">
                  Total vendor bills paid from your pocket
                </p>
              </div>
              <div className="p-2.5 bg-primary-50 text-primary-600 rounded-xl">
                <TrendingUp className="w-5 h-5" />
              </div>
            </div>
          </Card>

          <Card className="border-l-4 border-l-emerald-500 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Reimbursed</p>
                <p className="text-2xl sm:text-3xl font-black text-emerald-600 mt-1">
                  {formatCurrency(userAccount?.totalReimbursed || 0)}
                </p>
                <p className="text-[11px] text-gray-400 mt-1">
                  Settled & paid back to you by club
                </p>
              </div>
              <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
                <CheckCircle className="w-5 h-5" />
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Admin Quick Action Banner if pending requests exist */}
      {isAdmin && totalPendingActionItems > 0 && (
        <div className="p-4 bg-amber-50/90 border border-amber-200 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 text-amber-800 rounded-xl">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-amber-900">
                {totalPendingActionItems} Item{totalPendingActionItems > 1 ? 's' : ''} Awaiting Admin Approval
              </p>
              <p className="text-xs text-amber-700">
                {pendingAdminClaims.length} Reimbursement Claim{pendingAdminClaims.length > 1 ? 's' : ''} • {pendingExpenses.length} Master Account Expense Request{pendingExpenses.length > 1 ? 's' : ''} ({formatCurrency(totalPendingPayouts)})
              </p>
            </div>
          </div>
          <Button
            size="sm"
            onClick={() => setActiveTab('ADMIN_APPROVALS')}
            className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold shadow-xs"
          >
            Review Approvals Queue ({totalPendingActionItems}) →
          </Button>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200 gap-6">
        <button
          onClick={() => setActiveTab('MY_CLAIMS')}
          className={`pb-3 text-sm font-semibold border-b-2 transition-colors ${
            activeTab === 'MY_CLAIMS'
              ? 'border-primary-600 text-primary-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          My Reimbursement Claims ({myClaims.length})
        </button>

        {isAdmin && (
          <>
            <button
              onClick={() => setActiveTab('ADMIN_APPROVALS')}
              className={`pb-3 text-sm font-semibold border-b-2 transition-colors flex items-center gap-2 ${
                activeTab === 'ADMIN_APPROVALS'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              Admin Approvals Queue
              {totalPendingActionItems > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-amber-100 text-amber-800 font-bold">
                  {totalPendingActionItems}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('MEMBER_BALANCES')}
              className={`pb-3 text-sm font-semibold border-b-2 transition-colors flex items-center gap-2 ${
                activeTab === 'MEMBER_BALANCES'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Users className="w-4 h-4" />
              Member Ledgers Directory
            </button>
          </>
        )}
      </div>

      {/* Tab 1: My Claims */}
      {activeTab === 'MY_CLAIMS' && (
        <Card>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-900">My Claim History</h2>
            <div className="flex items-center gap-2">
              <Link href={APP_ROUTES.EXPENSE_RECORD}>
                <Button size="sm" variant="outline" className="text-xs flex items-center gap-1">
                  <Receipt className="w-3.5 h-3.5" />
                  Record Expense
                </Button>
              </Link>
              <Button size="sm" onClick={handleOpenClaimModal} className="text-xs">
                + Raise Money Request
              </Button>
            </div>
          </div>

          {myClaims.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200">
              <Wallet className="w-10 h-10 text-gray-300 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-600">No reimbursement claims raised yet.</p>
              <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto">
                When you pay vendor expenses out of pocket, you can raise a money request here to get reimbursed from the club treasury.
              </p>
              <div className="flex justify-center gap-3 mt-4">
                <Link href={APP_ROUTES.EXPENSE_RECORD}>
                  <Button size="sm" variant="outline" className="text-xs flex items-center gap-1.5">
                    <Receipt className="w-3.5 h-3.5" />
                    Record Out-of-Pocket Expense
                  </Button>
                </Link>
                <Button size="sm" onClick={handleOpenClaimModal} className="text-xs">
                  Raise Money Request
                </Button>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-gray-200 text-gray-500 font-semibold bg-gray-50/50">
                    <th className="py-2.5 px-3">Date</th>
                    <th className="py-2.5 px-3">Purpose / Notes</th>
                    <th className="py-2.5 px-3">Linked Festival</th>
                    <th className="py-2.5 px-3">Amount</th>
                    <th className="py-2.5 px-3">Payout Destination</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3 text-right">Receipt / Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {myClaims.map((claim) => (
                    <tr key={claim.id} className="hover:bg-gray-50/80 transition-colors">
                      <td className="py-3 px-3 text-gray-500">{formatDate(claim.createdAt)}</td>
                      <td className="py-3 px-3 font-semibold text-gray-800">{claim.notes}</td>
                      <td className="py-3 px-3 text-gray-600">{claim.festivalName || 'General Operation'}</td>
                      <td className="py-3 px-3 font-bold text-primary-700 text-sm">{formatCurrency(claim.amount)}</td>
                      <td className="py-3 px-3 text-gray-500">{claim.payoutDetails || 'Direct Settlement'}</td>
                      <td className="py-3 px-3">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                          claim.status === 'APPROVED'
                            ? 'bg-emerald-100 text-emerald-800'
                            : claim.status === 'PENDING'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}>
                          {claim.status === 'APPROVED' && <CheckCircle className="w-3 h-3 text-emerald-600" />}
                          {claim.status === 'PENDING' && <Clock className="w-3 h-3 text-amber-600" />}
                          {claim.status === 'REJECTED' && <XCircle className="w-3 h-3 text-rose-600" />}
                          {claim.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        {claim.status === 'APPROVED' ? (
                          <button
                            type="button"
                            onClick={() => downloadExistingVoucher(claim)}
                            className="inline-flex items-center gap-1 text-xs text-primary-600 hover:text-primary-800 font-semibold bg-primary-50 px-2.5 py-1 rounded-lg border border-primary-200 transition-colors"
                          >
                            <Download className="w-3.5 h-3.5" />
                            Voucher
                          </button>
                        ) : (
                          <span className="text-gray-400 text-[11px]">
                            {claim.status === 'REJECTED' ? claim.rejectionReason || 'Declined' : 'Awaiting Review'}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      )}

      {/* Tab 2: Admin Approvals Queue */}
      {isAdmin && activeTab === 'ADMIN_APPROVALS' && (
        <div className="space-y-6">
          {/* Section A: Pending Master Account Expenses */}
          {pendingExpenses.length > 0 && (
            <Card className="border border-sky-200">
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-2">
                  <Landmark className="w-5 h-5 text-sky-600" />
                  <div>
                    <h3 className="text-base font-bold text-gray-900">Pending Master Account Expense Requests</h3>
                    <p className="text-xs text-gray-500">Expenses recorded by members requesting direct payment from Club Treasury</p>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-sky-100 text-sky-800">
                  {pendingExpenses.length} Pending
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b border-gray-200 text-gray-500 font-semibold bg-gray-50/50">
                      <th className="py-2 px-3">Date</th>
                      <th className="py-2 px-3">Requested By</th>
                      <th className="py-2 px-3">Purpose / Vendor</th>
                      <th className="py-2 px-3">Amount</th>
                      <th className="py-2 px-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {pendingExpenses.map((exp) => (
                      <tr key={exp.id} className="hover:bg-gray-50/80">
                        <td className="py-2.5 px-3 text-gray-500">{formatDate(exp.expenseDate)}</td>
                        <td className="py-2.5 px-3 font-semibold text-gray-800">{exp.paidByUserName || 'Member'}</td>
                        <td className="py-2.5 px-3">
                          <p className="font-semibold text-gray-900">{exp.purpose}</p>
                          <p className="text-[11px] text-gray-400">Vendor: {exp.paidTo}</p>
                        </td>
                        <td className="py-2.5 px-3 font-bold text-sky-700 text-sm">{formatCurrency(exp.amount)}</td>
                        <td className="py-2.5 px-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <Button
                              size="sm"
                              onClick={() => handleApproveExpense(exp)}
                              isLoading={processingId === exp.id}
                              disabled={processingId === exp.id}
                              className="bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] py-1 px-2.5 h-auto shadow-2xs"
                            >
                              Approve & Deduct Treasury
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleRejectExpense(exp)}
                              disabled={processingId === exp.id}
                              className="text-rose-600 border-rose-200 hover:bg-rose-50 text-[11px] py-1 px-2 h-auto"
                            >
                              Reject
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}

          {/* Section B: Member Reimbursement Claims */}
          <Card>
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Member Reimbursement Claims Queue</h2>
                <p className="text-xs text-gray-500">Authorize out-of-pocket payout claims and generate settlement vouchers</p>
              </div>
            </div>

            {allClaims.length === 0 ? (
              <p className="text-center text-gray-400 py-10 text-xs">No reimbursement claims in system.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b border-gray-200 text-gray-500 font-semibold bg-gray-50/50">
                      <th className="py-2.5 px-3">Date</th>
                      <th className="py-2.5 px-3">Member Beneficiary</th>
                      <th className="py-2.5 px-3">Purpose & Festival</th>
                      <th className="py-2.5 px-3">Claim Amount</th>
                      <th className="py-2.5 px-3">Payout Destination</th>
                      <th className="py-2.5 px-3">Status</th>
                      <th className="py-2.5 px-3 text-right">Admin Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {allClaims.map((claim) => (
                      <tr key={claim.id} className="hover:bg-gray-50/80 transition-colors">
                        <td className="py-3 px-3 text-gray-500">{formatDate(claim.createdAt)}</td>
                        <td className="py-3 px-3">
                          <p className="font-bold text-gray-800">{claim.userName}</p>
                          <p className="text-[11px] text-gray-400">{claim.userEmail}</p>
                        </td>
                        <td className="py-3 px-3">
                          <p className="font-semibold text-gray-800">{claim.notes}</p>
                          <p className="text-[11px] text-gray-400">{claim.festivalName || 'General Operations'}</p>
                        </td>
                        <td className="py-3 px-3 font-bold text-primary-700 text-sm">{formatCurrency(claim.amount)}</td>
                        <td className="py-3 px-3 text-gray-600 font-medium">{claim.payoutDetails || 'Direct Settlement'}</td>
                        <td className="py-3 px-3">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                            claim.status === 'APPROVED'
                              ? 'bg-emerald-100 text-emerald-800'
                              : claim.status === 'PENDING'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}>
                            {claim.status === 'APPROVED' && <CheckCircle className="w-3 h-3 text-emerald-600" />}
                            {claim.status === 'PENDING' && <Clock className="w-3 h-3 text-amber-600" />}
                            {claim.status === 'REJECTED' && <XCircle className="w-3 h-3 text-rose-600" />}
                            {claim.status}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right">
                          {claim.status === 'PENDING' ? (
                            <div className="flex items-center justify-end gap-1.5">
                              <Button
                                size="sm"
                                onClick={() => handleApproveClaim(claim)}
                                isLoading={processingId === claim.id}
                                disabled={processingId === claim.id}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] py-1 px-2.5 h-auto shadow-2xs"
                              >
                                Approve & Pay
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleRejectClaim(claim)}
                                disabled={processingId === claim.id}
                                className="text-rose-600 border-rose-200 hover:bg-rose-50 text-[11px] py-1 px-2 h-auto"
                              >
                                Reject
                              </Button>
                            </div>
                          ) : claim.status === 'APPROVED' ? (
                            <button
                              type="button"
                              onClick={() => downloadExistingVoucher(claim)}
                              className="inline-flex items-center gap-1 text-xs text-primary-600 hover:text-primary-800 font-semibold bg-primary-50 px-2.5 py-1 rounded-lg border border-primary-200"
                            >
                              <Download className="w-3.5 h-3.5" />
                              Voucher
                            </button>
                          ) : (
                            <span className="text-gray-400 text-[11px]">Rejected</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </div>
      )}

      {/* Tab 3: Member Ledgers Directory */}
      {isAdmin && activeTab === 'MEMBER_BALANCES' && (
        <Card>
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Member Out-of-Pocket Balances Directory</h2>
              <p className="text-xs text-gray-500">Overview of all members who have paid expenses from their pocket</p>
            </div>
          </div>

          {allUserAccounts.length === 0 ? (
            <p className="text-center text-gray-400 py-10 text-xs">No member ledgers recorded yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-gray-200 text-gray-500 font-semibold bg-gray-50/50">
                    <th className="py-2.5 px-3">Member</th>
                    <th className="py-2.5 px-3">Total Spent Out-of-Pocket</th>
                    <th className="py-2.5 px-3">Total Reimbursed</th>
                    <th className="py-2.5 px-3">Pending Balance Owed</th>
                    <th className="py-2.5 px-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {allUserAccounts.map((acc) => (
                    <tr key={acc.id} className="hover:bg-gray-50/80 transition-colors">
                      <td className="py-3 px-3">
                        <p className="font-bold text-gray-800">{acc.userName}</p>
                        <p className="text-[11px] text-gray-400">{acc.userEmail}</p>
                      </td>
                      <td className="py-3 px-3 font-semibold text-gray-700">{formatCurrency(acc.totalPaidOutOfPocket)}</td>
                      <td className="py-3 px-3 font-semibold text-emerald-600">{formatCurrency(acc.totalReimbursed)}</td>
                      <td className="py-3 px-3 font-extrabold text-sm text-amber-600">
                        {formatCurrency(acc.pendingReimbursement)}
                      </td>
                      <td className="py-3 px-3 text-right">
                        {acc.pendingReimbursement > 0 ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                            Claimable
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-gray-100 text-gray-600">
                            Settled
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      )}

      {/* Modal: Raise Money / Reimbursement Request */}
      {showClaimModal && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-lg bg-white shadow-2xl rounded-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center pb-3 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <Wallet className="w-5 h-5 text-primary-600" />
                <h3 className="text-lg font-bold text-gray-900">Raise Money Request</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowClaimModal(false)}
                className="text-gray-400 hover:text-gray-600 text-lg p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateClaim} className="space-y-4 pt-4">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-semibold text-gray-700">
                    Claim Amount (₹) <span className="text-red-500">*</span>
                  </label>
                  {userAccount && userAccount.pendingReimbursement > 0 && (
                    <button
                      type="button"
                      onClick={() => setClaimAmount(userAccount.pendingReimbursement)}
                      className="text-[11px] text-primary-600 font-semibold hover:underline"
                    >
                      Claim full pending balance ({formatCurrency(userAccount.pendingReimbursement)})
                    </button>
                  )}
                </div>
                <Input
                  type="number"
                  value={claimAmount.toString()}
                  onChange={(e) => setClaimAmount(parseFloat(e.target.value) || 0)}
                  min="1"
                  required
                  placeholder="Enter amount to request"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Linked Festival / Event (Optional)
                </label>
                <select
                  value={claimFestivalId}
                  onChange={(e) => setClaimFestivalId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">General Club Operation</option>
                  {festivals.map((f) => (
                    <option key={f.id} value={f.id}>{f.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <Input
                  label="Payout Destination (UPI ID / PhonePe / GPay / Bank)"
                  value={claimPayoutDetails}
                  onChange={(e) => setClaimPayoutDetails(e.target.value)}
                  placeholder="e.g. rajat@oksbi or 9876543210@paytm"
                  required
                />
              </div>

              <div>
                <Textarea
                  label="Purpose / Expense Details"
                  value={claimNotes}
                  onChange={(e) => setClaimNotes(e.target.value)}
                  placeholder="e.g., Reimbursing cash paid for sound system, stage lights & transportation"
                  rows={3}
                  required
                />
              </div>

              <div className="flex gap-3 pt-2">
                <Button type="submit" isLoading={submittingClaim} disabled={submittingClaim} className="flex-1 text-xs">
                  Submit Claim Request
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowClaimModal(false)}
                  disabled={submittingClaim}
                  className="text-xs"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
