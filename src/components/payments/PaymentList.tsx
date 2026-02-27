'use client';

import React, { useEffect, useState } from 'react';
import { paymentController } from '@/controllers/payment.controller';
import { Payment, Receipt } from '@/models';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Loader } from '@/components/ui/Loader';
import { ReceiptViewer } from './ReceiptViewer';
import { formatCurrency, formatDate } from '@/utils';
import { Download, Eye } from 'lucide-react';
import Link from 'next/link';

interface PaymentListProps {
  festivalId?: string;
}

export const PaymentList: React.FC<PaymentListProps> = ({ festivalId }) => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedReceipt, setSelectedReceipt] = useState<Receipt | null>(null);
  const [loadingReceipt, setLoadingReceipt] = useState<string | null>(null);

  useEffect(() => {
    const loadPayments = async () => {
      try {
        let data: Payment[];
        if (festivalId) {
          data = await paymentController.getPaymentsByFestival(festivalId);
        } else {
          data = await paymentController.getAllPayments();
        }
        setPayments(data);
      } catch (err) {
        console.error('Failed to load payments:', err);
        setError('Failed to load payments');
      } finally {
        setLoading(false);
      }
    };

    loadPayments();
  }, [festivalId]);

  const handleViewReceipt = async (paymentId: string) => {
    setLoadingReceipt(paymentId);
    try {
      const receipt = await paymentController.getReceiptForPayment(paymentId);
      if (receipt) {
        setSelectedReceipt(receipt);
      } else {
        alert('No receipt found for this payment.');
      }
    } catch (err) {
      console.error('Error loading receipt:', err);
      alert('Failed to load receipt.');
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
      } else {
        alert('No receipt found for this payment.');
      }
    } catch (err) {
      console.error('Error downloading receipt:', err);
      alert('Failed to download receipt.');
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

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">
          {festivalId ? 'Festival Payments' : 'All Payments'}
        </h2>
        <Link href="/payments/record">
          <Button size="sm">Record Payment</Button>
        </Link>
      </div>

      {payments.length === 0 ? (
        <Card>
          <p className="text-center text-gray-500 py-8">No payments found</p>
        </Card>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full bg-white rounded-lg shadow">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Date</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Amount</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Status</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Receipt #</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment) => (
                <tr key={payment.id} className="border-b last:border-0 hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm">{formatDate(payment.paidDate)}</td>
                  <td className="px-4 py-3 text-sm font-medium">{formatCurrency(payment.amount)}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      payment.status === 'PAID' ? 'bg-green-100 text-green-700' :
                      payment.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {payment.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {payment.receiptNumber || '-'}
                  </td>
                  <td className="px-4 py-3">
                    {payment.status === 'PAID' && payment.receiptNumber && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleViewReceipt(payment.id)}
                          disabled={loadingReceipt === payment.id}
                          className="text-blue-600 hover:text-blue-800 disabled:opacity-50 flex items-center gap-1 text-sm"
                          title="View Receipt"
                        >
                          <Eye size={16} />
                          View
                        </button>
                        <button
                          onClick={() => handleDownloadReceipt(payment.id, payment.receiptNumber)}
                          disabled={loadingReceipt === payment.id}
                          className="text-green-600 hover:text-green-800 disabled:opacity-50 flex items-center gap-1 text-sm"
                          title="Download Receipt"
                        >
                          <Download size={16} />
                          Download
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
