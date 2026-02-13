'use client';

import React, { useEffect, useState } from 'react';
import { paymentController } from '@/controllers/payment.controller';
import { Payment } from '@/models';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Loader } from '@/components/ui/Loader';
import { formatCurrency, formatDate } from '@/utils';
import Link from 'next/link';

interface PaymentListProps {
  festivalId?: string;
}

export const PaymentList: React.FC<PaymentListProps> = ({ festivalId }) => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
