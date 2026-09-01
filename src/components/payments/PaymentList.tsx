'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { paymentController } from '@/controllers/payment.controller';
import { familyController } from '@/controllers/family.controller';
import { festivalController } from '@/controllers/festival.controller';
import { Payment, Receipt, Family, Festival } from '@/models';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Loader } from '@/components/ui/Loader';
import { ReceiptViewer } from './ReceiptViewer';
import { formatCurrency, formatDate } from '@/utils';
import { Download, Eye, CheckCircle2, Clock, AlertCircle, PlusCircle, RefreshCw, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { APP_ROUTES } from '@/core/routes';

interface PaymentListProps {
  festivalId?: string;
}

export const PaymentList: React.FC<PaymentListProps> = ({ festivalId }) => {
  const { user, isAdmin } = useAuth();
  const { toast } = useToast();

  const [payments, setPayments] = useState<Payment[]>([]);
  const [families, setFamilies] = useState<Record<string, Family>>({});
  const [festivals, setFestivals] = useState<Record<string, Festival>>({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [selectedReceipt, setSelectedReceipt] = useState<Receipt | null>(null);
  const [loadingReceipt, setLoadingReceipt] = useState<string | null>(null);
  const [verifyingId, setVerifyingId] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'VERIFIED' | 'PENDING'>('ALL');

  const loadPayments = useCallback(async (isManual = false) => {
    if (isManual) setRefreshing(true);
    else setLoading(true);

    try {
      const [paymentsData, familiesData, festivalsData] = await Promise.all([
        festivalId 
          ? paymentController.getPaymentsByFestival(festivalId) 
          : paymentController.getAllPayments(),
        familyController.getAllFamilies(),
        festivalController.getAllFestivals(),
      ]);

      setPayments(paymentsData);

      const famMap: Record<string, Family> = {};
      familiesData.forEach(f => { famMap[f.id] = f; });
      setFamilies(famMap);

      const festMap: Record<string, Festival> = {};
      festivalsData.forEach(f => { festMap[f.id] = f; });
      setFestivals(festMap);
    } catch (err) {
      console.error('Failed to load payments:', err);
      setError('Failed to load payments');
      if (isManual) toast.error('Failed to load payments', 'Payments Error');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [festivalId]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    loadPayments();
  }, [loadPayments]);

  const handleVerifyPayment = async (payment: Payment) => {
    if (!user?.id) return;

    const familyName = families[payment.familyId]?.headName || 'Member Family';
    const festivalName = festivals[payment.festivalId]?.name || 'Festival';

    const confirmVerify = window.confirm(
      `Verify and confirm payment from ${familyName} for ${festivalName}?\n\n` +
      `Amount: ₹${payment.amount.toLocaleString('en-IN')}\n\n` +
      `This will:\n1. Change status to PAID & VERIFIED\n2. Add ₹${payment.amount.toLocaleString('en-IN')} to Master Account treasury\n3. Generate and download official verified receipt`
    );

    if (!confirmVerify) return;

    setVerifyingId(payment.id);
    try {
      const { receipt, pdfBlob } = await paymentController.verifyPayment(payment.id, {
        id: user.id,
        name: user.name || 'Admin',
      });

      // Download official receipt
      const url = URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${receipt.receiptNumber}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success(
        `Payment verified & marked as PAID! ₹${payment.amount.toLocaleString('en-IN')} added to Master Account. Receipt ${receipt.receiptNumber} downloaded.`,
        'Payment Verified'
      );
      await loadPayments(true);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to verify payment';
      toast.error(msg, 'Verification Failed');
    } finally {
      setVerifyingId(null);
    }
  };

  const handleViewReceipt = async (paymentId: string) => {
    setLoadingReceipt(paymentId);
    try {
      const receipt = await paymentController.getReceiptForPayment(paymentId);
      if (receipt) {
        setSelectedReceipt(receipt);
      } else {
        toast.warning('No receipt found for this payment.', 'Receipt Not Found');
      }
    } catch (err) {
      console.error('Error loading receipt:', err);
      toast.error('Failed to load receipt.', 'Error');
    } finally {
      setLoadingReceipt(null);
    }
  };

  const handleDownloadReceipt = async (paymentId: string) => {
    setLoadingReceipt(paymentId);
    try {
      const result = await paymentController.downloadReceiptForPayment(paymentId);
      if (result) {
        // Download the PDF
        const url = URL.createObjectURL(result.pdfBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${result.receiptNumber}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        toast.success(`Receipt/Slip ${result.receiptNumber} downloaded.`, 'Download Successful');
      } else {
        toast.warning('No receipt found for this payment.', 'Receipt Not Found');
      }
    } catch (err) {
      console.error('Error downloading receipt:', err);
      toast.error('Failed to download receipt.', 'Download Error');
    } finally {
      setLoadingReceipt(null);
    }
  };

  if (selectedReceipt) {
    return (
      <ReceiptViewer
        receipt={selectedReceipt}
        onClose={() => setSelectedReceipt(null)}
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

  const pendingPayments = payments.filter(p => p.status !== 'PAID');
  const verifiedPayments = payments.filter(p => p.status === 'PAID');
  
  const displayedPayments = activeFilter === 'VERIFIED' 
    ? verifiedPayments 
    : activeFilter === 'PENDING' 
    ? pendingPayments 
    : payments;

  return (
    <div className="space-y-4">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h2 className="text-xl font-bold text-gray-800">
            {festivalId ? 'Festival Payments' : 'Chanda & Contribution Payments'}
          </h2>
          <p className="text-xs text-gray-500">
            {isAdmin 
              ? 'Manage collections, verify member submissions, and issue receipts' 
              : 'View contributions and record community chanda payments'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => loadPayments(true)}
            isLoading={refreshing}
            disabled={refreshing}
            className="flex items-center gap-1.5 text-xs text-gray-700"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Link href={APP_ROUTES.PAYMENT_RECORD}>
            <Button size="sm" className="flex items-center gap-1.5 text-xs">
              <PlusCircle className="w-3.5 h-3.5" />
              Record Payment
            </Button>
          </Link>
        </div>
      </div>

      {/* Admin Pending Verification Banner */}
      {isAdmin && pendingPayments.length > 0 && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 text-amber-800 rounded-lg">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-amber-900">
                {pendingPayments.length} Payment{pendingPayments.length > 1 ? 's' : ''} Awaiting Admin Verification
              </p>
              <p className="text-xs text-amber-700">
                Members recorded these payments. Verify them to officially credit the Master Account.
              </p>
            </div>
          </div>
          <Button
            size="sm"
            onClick={() => setActiveFilter('PENDING')}
            className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold"
          >
            View Verification Queue ({pendingPayments.length})
          </Button>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex border-b border-gray-200 gap-4 text-xs font-semibold">
        <button
          onClick={() => setActiveFilter('ALL')}
          className={`pb-2.5 transition-colors border-b-2 ${
            activeFilter === 'ALL'
              ? 'border-primary-600 text-primary-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          All Payments ({payments.length})
        </button>
        <button
          onClick={() => setActiveFilter('VERIFIED')}
          className={`pb-2.5 transition-colors border-b-2 ${
            activeFilter === 'VERIFIED'
              ? 'border-primary-600 text-primary-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Verified & Paid ({verifiedPayments.length})
        </button>
        <button
          onClick={() => setActiveFilter('PENDING')}
          className={`pb-2.5 transition-colors border-b-2 flex items-center gap-1.5 ${
            activeFilter === 'PENDING'
              ? 'border-primary-600 text-primary-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Pending Verification ({pendingPayments.length})
          {pendingPayments.length > 0 && (
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-100 text-amber-800 font-bold">
              {pendingPayments.length}
            </span>
          )}
        </button>
      </div>

      {displayedPayments.length === 0 ? (
        <Card>
          <p className="text-center text-gray-500 py-8 text-sm">
            {activeFilter === 'PENDING' 
              ? 'No payments pending verification.' 
              : activeFilter === 'VERIFIED' 
              ? 'No verified payments found.' 
              : 'No payments found.'}
          </p>
        </Card>
      ) : (
        <div className="overflow-x-auto bg-white rounded-xl border border-gray-200 shadow-xs">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-200 text-gray-500 font-semibold">
                <th className="px-3.5 py-3">Date</th>
                <th className="px-3.5 py-3">Family</th>
                <th className="px-3.5 py-3">Festival / Event</th>
                <th className="px-3.5 py-3">Amount</th>
                <th className="px-3.5 py-3">Status</th>
                <th className="px-3.5 py-3">Slip / Receipt #</th>
                <th className="px-3.5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {displayedPayments.map((payment) => {
                const family = families[payment.familyId];
                const festival = festivals[payment.festivalId];
                const isPaid = payment.status === 'PAID';

                return (
                  <tr key={payment.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="px-3.5 py-3 text-gray-500">{formatDate(payment.paidDate)}</td>
                    <td className="px-3.5 py-3 font-semibold text-gray-900">
                      {family ? `${family.headName} (${family.phone})` : 'Unknown Family'}
                    </td>
                    <td className="px-3.5 py-3 text-gray-600">
                      {festival ? festival.name : 'General'}
                    </td>
                    <td className="px-3.5 py-3 font-bold text-sm text-primary-700">
                      {formatCurrency(payment.amount)}
                    </td>
                    <td className="px-3.5 py-3">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                        isPaid 
                          ? 'bg-emerald-100 text-emerald-800' 
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {isPaid ? <CheckCircle2 className="w-3 h-3 text-emerald-600" /> : <Clock className="w-3 h-3 text-amber-600" />}
                        {isPaid ? 'PAID (Verified)' : 'UNPAID (Pending Verification)'}
                      </span>
                    </td>
                    <td className="px-3.5 py-3 text-gray-500 font-mono text-[11px]">
                      {payment.receiptNumber || '-'}
                    </td>
                    <td className="px-3.5 py-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Admin 1-Click Verification Action */}
                        {!isPaid && isAdmin && (
                          <Button
                            size="sm"
                            onClick={() => handleVerifyPayment(payment)}
                            isLoading={verifyingId === payment.id}
                            disabled={verifyingId === payment.id}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] py-1 px-2 h-auto flex items-center gap-1"
                          >
                            <ShieldCheck className="w-3 h-3" />
                            Verify & Mark as Paid
                          </Button>
                        )}

                        {/* Download Slip or Receipt */}
                        <button
                          onClick={() => handleDownloadReceipt(payment.id)}
                          disabled={loadingReceipt === payment.id}
                          className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-1 rounded-lg border border-gray-200 hover:bg-gray-100 text-gray-700"
                          title={isPaid ? "Download Official Receipt" : "Download Provisional Slip"}
                        >
                          <Download size={13} />
                          {isPaid ? 'Receipt' : 'Slip'}
                        </button>

                        {isPaid && (
                          <button
                            onClick={() => handleViewReceipt(payment.id)}
                            disabled={loadingReceipt === payment.id}
                            className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-1 rounded-lg text-primary-600 hover:bg-primary-50"
                            title="View Receipt"
                          >
                            <Eye size={13} />
                            View
                          </button>
                        )}
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
