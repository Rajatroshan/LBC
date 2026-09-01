'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { expenseController } from '@/controllers/expense.controller';
import { invoiceController } from '@/controllers/invoice.controller';
import { festivalController } from '@/controllers/festival.controller';
import { Expense, Invoice, Festival } from '@/models';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Loader } from '@/components/ui/Loader';
import { InvoiceViewer } from './InvoiceViewer';
import { formatCurrency, formatDate } from '@/utils';
import { APP_ROUTES } from '@/core/routes';
import { EXPENSE_CATEGORY_LABELS, PAYMENT_SOURCES } from '@/constants';
import { 
  Eye, 
  Download, 
  PlusCircle, 
  RefreshCw, 
  ShieldCheck, 
  AlertCircle, 
  Clock, 
  CheckCircle2, 
  XCircle,
  Landmark,
  Wallet
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';

interface ExpenseListProps {
  festivalId?: string;
}

export const ExpenseList: React.FC<ExpenseListProps> = ({ festivalId }) => {
  const { user, isAdmin } = useAuth();
  const { toast } = useToast();

  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [festivals, setFestivals] = useState<Record<string, Festival>>({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [loadingInvoice, setLoadingInvoice] = useState<string | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'APPROVED' | 'PENDING' | 'PERSONAL'>('ALL');

  const loadExpenses = useCallback(async (isManual = false) => {
    if (isManual) setRefreshing(true);
    else setLoading(true);

    try {
      const [expensesData, festivalsData] = await Promise.all([
        festivalId 
          ? expenseController.getExpensesByFestival(festivalId) 
          : expenseController.getAllExpenses(),
        festivalController.getAllFestivals(),
      ]);

      setExpenses(expensesData);

      const festMap: Record<string, Festival> = {};
      festivalsData.forEach(f => { festMap[f.id] = f; });
      setFestivals(festMap);
      setError('');
    } catch (err) {
      console.error('Failed to load expenses:', err);
      const errorMsg = err instanceof Error ? err.message : 'Failed to load expenses';
      setError(errorMsg);
      if (isManual) toast.error(errorMsg, 'Expenses Error');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [festivalId]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    loadExpenses();
  }, [loadExpenses]);

  const handleApproveExpense = async (expense: Expense) => {
    if (!user?.id) return;

    const confirmApprove = window.confirm(
      `Approve Master Account payment for ₹${expense.amount.toLocaleString('en-IN')} (${expense.purpose})?\n\n` +
      `This will immediately deduct ₹${expense.amount.toLocaleString('en-IN')} from the Club Master Account.`
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
      await loadExpenses(true);
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

      toast.info(`Expense request was marked as Rejected.`, 'Expense Rejected');
      await loadExpenses(true);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to reject expense';
      toast.error(msg, 'Rejection Error');
    } finally {
      setProcessingId(null);
    }
  };

  const handleViewInvoice = async (expenseId: string) => {
    setLoadingInvoice(expenseId);
    try {
      const invoice = await invoiceController.getInvoiceForExpense(expenseId);
      if (invoice) {
        setSelectedInvoice(invoice);
      } else {
        toast.warning('No invoice found for this expense.', 'Invoice Not Found');
      }
    } catch (err) {
      console.error('Error loading invoice:', err);
      toast.error('Failed to load invoice.', 'Error');
    } finally {
      setLoadingInvoice(null);
    }
  };

  const handleDownloadInvoice = async (expenseId: string) => {
    setLoadingInvoice(expenseId);
    try {
      const result = await invoiceController.downloadInvoiceForExpense(expenseId);
      if (result) {
        const url = URL.createObjectURL(result.pdfBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${result.invoiceNumber}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        toast.success(`Invoice ${result.invoiceNumber} downloaded.`, 'Invoice Downloaded');
      } else {
        toast.warning('No invoice found for this expense.', 'Invoice Not Found');
      }
    } catch (err) {
      console.error('Error downloading invoice:', err);
      toast.error('Failed to download invoice.', 'Download Error');
    } finally {
      setLoadingInvoice(null);
    }
  };

  if (selectedInvoice) {
    return (
      <InvoiceViewer
        invoice={selectedInvoice}
        onClose={() => setSelectedInvoice(null)}
      />
    );
  }

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
      </Card>
    );
  }

  const pendingExpenses = expenses.filter(e => e.approvalStatus === 'PENDING_APPROVAL');
  const approvedExpenses = expenses.filter(e => e.approvalStatus === 'APPROVED' || !e.approvalStatus);
  const outOfPocketExpenses = expenses.filter(e => e.paymentSource === PAYMENT_SOURCES.PERSONAL_OUT_OF_POCKET);

  const displayedExpenses = activeFilter === 'APPROVED'
    ? approvedExpenses
    : activeFilter === 'PENDING'
    ? pendingExpenses
    : activeFilter === 'PERSONAL'
    ? outOfPocketExpenses
    : expenses;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h2 className="text-xl font-bold text-gray-800">
            {festivalId ? 'Festival Expenses' : 'Vendor Expenses & Disbursements'}
          </h2>
          <p className="text-xs text-gray-500">
            {isAdmin
              ? 'Track supplier bills, approve pending master account requests, and issue invoices'
              : 'View recorded vendor expenses, out-of-pocket claims, and club payments'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => loadExpenses(true)}
            isLoading={refreshing}
            disabled={refreshing}
            className="flex items-center gap-1.5 text-xs text-gray-700"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Link href={APP_ROUTES.EXPENSE_RECORD}>
            <Button size="sm" className="flex items-center gap-1.5 text-xs bg-amber-600 hover:bg-amber-700 text-white">
              <PlusCircle className="w-3.5 h-3.5" />
              Record Expense
            </Button>
          </Link>
        </div>
      </div>

      {/* Admin Pending Master Account Expense Queue Banner */}
      {isAdmin && pendingExpenses.length > 0 && (
        <div className="p-4 bg-sky-50 border border-sky-200 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-sky-100 text-sky-800 rounded-lg">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-sky-900">
                {pendingExpenses.length} Master Account Expense{pendingExpenses.length > 1 ? 's' : ''} Awaiting Admin Approval
              </p>
              <p className="text-xs text-sky-700">
                Members requested direct treasury payment for these vendor bills. Approve to disburse funds.
              </p>
            </div>
          </div>
          <Button
            size="sm"
            onClick={() => setActiveFilter('PENDING')}
            className="bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold"
          >
            View Approvals Queue ({pendingExpenses.length})
          </Button>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex border-b border-gray-200 gap-4 text-xs font-semibold">
        <button
          onClick={() => setActiveFilter('ALL')}
          className={`pb-2.5 transition-colors border-b-2 ${
            activeFilter === 'ALL'
              ? 'border-amber-600 text-amber-600 font-bold'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          All Expenses ({expenses.length})
        </button>
        <button
          onClick={() => setActiveFilter('APPROVED')}
          className={`pb-2.5 transition-colors border-b-2 ${
            activeFilter === 'APPROVED'
              ? 'border-amber-600 text-amber-600 font-bold'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Approved & Disbursed ({approvedExpenses.length})
        </button>
        <button
          onClick={() => setActiveFilter('PENDING')}
          className={`pb-2.5 transition-colors border-b-2 flex items-center gap-1.5 ${
            activeFilter === 'PENDING'
              ? 'border-amber-600 text-amber-600 font-bold'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Pending Admin Approval ({pendingExpenses.length})
          {pendingExpenses.length > 0 && (
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-sky-100 text-sky-800 font-bold">
              {pendingExpenses.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveFilter('PERSONAL')}
          className={`pb-2.5 transition-colors border-b-2 ${
            activeFilter === 'PERSONAL'
              ? 'border-amber-600 text-amber-600 font-bold'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Out-of-Pocket Claims ({outOfPocketExpenses.length})
        </button>
      </div>

      {displayedExpenses.length === 0 ? (
        <Card>
          <div className="text-center py-10">
            <p className="text-gray-500 text-sm">
              {activeFilter === 'PENDING'
                ? 'No expenses pending admin approval.'
                : activeFilter === 'APPROVED'
                ? 'No approved expenses found.'
                : activeFilter === 'PERSONAL'
                ? 'No out-of-pocket expenses found.'
                : 'No expenses recorded yet.'}
            </p>
            <div className="mt-3">
              <Link href={APP_ROUTES.EXPENSE_RECORD}>
                <Button size="sm" className="text-xs bg-amber-600 hover:bg-amber-700 text-white">
                  + Record New Expense
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      ) : (
        <div className="overflow-x-auto bg-white rounded-xl border border-gray-200 shadow-xs">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-200 text-gray-500 font-semibold">
                <th className="px-3.5 py-3">Date</th>
                <th className="px-3.5 py-3">Paid By / Member</th>
                <th className="px-3.5 py-3">Purpose & Category</th>
                <th className="px-3.5 py-3">Vendor</th>
                <th className="px-3.5 py-3">Festival</th>
                <th className="px-3.5 py-3">Payment Source</th>
                <th className="px-3.5 py-3">Amount</th>
                <th className="px-3.5 py-3">Status</th>
                <th className="px-3.5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {displayedExpenses.map((expense) => {
                const festival = expense.festivalId ? festivals[expense.festivalId] : undefined;
                const isApproved = expense.approvalStatus === 'APPROVED' || !expense.approvalStatus;
                const isPending = expense.approvalStatus === 'PENDING_APPROVAL';
                const isRejected = expense.approvalStatus === 'REJECTED';
                const isMasterAccount = expense.paymentSource === PAYMENT_SOURCES.MASTER_ACCOUNT || !expense.paymentSource;

                return (
                  <tr key={expense.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="px-3.5 py-3 text-gray-500">{formatDate(expense.expenseDate)}</td>
                    <td className="px-3.5 py-3 font-medium text-gray-900">
                      {expense.paidByUserName || 'Admin'}
                    </td>
                    <td className="px-3.5 py-3">
                      <p className="font-semibold text-gray-900">{expense.purpose}</p>
                      <span className="inline-block mt-0.5 px-1.5 py-0.2 rounded text-[10px] bg-gray-100 text-gray-600 font-medium">
                        {EXPENSE_CATEGORY_LABELS[expense.category] || expense.category}
                      </span>
                    </td>
                    <td className="px-3.5 py-3 text-gray-600 font-medium">
                      {expense.paidTo}
                    </td>
                    <td className="px-3.5 py-3 text-gray-500">
                      {festival ? festival.name : 'General'}
                    </td>
                    <td className="px-3.5 py-3">
                      {isMasterAccount ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-primary-700 bg-primary-50 px-2 py-0.5 rounded-full">
                          <Landmark className="w-3 h-3 text-primary-600" />
                          Club Master
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full">
                          <Wallet className="w-3 h-3 text-amber-600" />
                          Out-of-Pocket
                        </span>
                      )}
                    </td>
                    <td className="px-3.5 py-3 font-bold text-sm text-amber-800">
                      {formatCurrency(expense.amount)}
                    </td>
                    <td className="px-3.5 py-3">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                        isApproved 
                          ? 'bg-emerald-100 text-emerald-800' 
                          : isPending 
                          ? 'bg-sky-100 text-sky-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}>
                        {isApproved && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                        {isPending && <Clock className="w-3 h-3 text-sky-600" />}
                        {isRejected && <XCircle className="w-3 h-3 text-rose-600" />}
                        {isApproved ? 'Approved' : isPending ? 'Pending Approval' : 'Rejected'}
                      </span>
                    </td>
                    <td className="px-3.5 py-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Admin 1-Click Approval Action for Pending Master Account Expenses */}
                        {isPending && isAdmin && (
                          <>
                            <Button
                              size="sm"
                              onClick={() => handleApproveExpense(expense)}
                              isLoading={processingId === expense.id}
                              disabled={processingId === expense.id}
                              className="bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] py-1 px-2 h-auto flex items-center gap-1"
                            >
                              <ShieldCheck className="w-3 h-3" />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleRejectExpense(expense)}
                              disabled={processingId === expense.id}
                              className="text-rose-600 border-rose-200 hover:bg-rose-50 text-[11px] py-1 px-2 h-auto"
                            >
                              Reject
                            </Button>
                          </>
                        )}

                        {/* Download and View Invoice */}
                        <button
                          onClick={() => handleDownloadInvoice(expense.id)}
                          disabled={loadingInvoice === expense.id}
                          className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-1 rounded-lg border border-gray-200 hover:bg-gray-100 text-gray-700"
                          title="Download Invoice"
                        >
                          <Download size={13} />
                          Invoice
                        </button>
                        <button
                          onClick={() => handleViewInvoice(expense.id)}
                          disabled={loadingInvoice === expense.id}
                          className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-1 rounded-lg text-primary-600 hover:bg-primary-50"
                          title="View Invoice"
                        >
                          <Eye size={13} />
                          View
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
