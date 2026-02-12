'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { Payment, Festival, Family } from '@/core/types';
import { paymentContainer } from '../../di/payment.container';
import { familyContainer } from '../../../family/di/family.container';
import { festivalContainer } from '../../../festival/di/festival.container';
import { Card, Button, Loader } from '@/core/ui';
import { formatDate, formatCurrency } from '@/utils';
import Link from 'next/link';
import { APP_ROUTES } from '@/core/routes';

export const PaymentList: React.FC<{ festivalId?: string }> = ({ festivalId }) => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [familiesMap, setFamiliesMap] = useState<Map<string, Family>>(new Map());
  const [festivalsMap, setFestivalsMap] = useState<Map<string, Festival>>(new Map());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'PAID' | 'UNPAID' | 'PENDING'>('ALL');

  const loadPayments = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const getPaymentsByFestivalUseCase = paymentContainer.getPaymentsByFestivalUseCase();
      const getFamiliesUseCase = familyContainer.getFamiliesUseCase();
      const getUpcomingFestivalsUseCase = festivalContainer.getUpcomingFestivalsUseCase();
      
      let paymentsData: Payment[] = [];
      
      if (festivalId) {
        paymentsData = await getPaymentsByFestivalUseCase.execute(festivalId);
      } else {
        // Get all payments by loading all festivals and their payments
        try {
          const festivalsData = await getUpcomingFestivalsUseCase.execute(100);
          for (const festival of festivalsData) {
            const festivalPayments = await getPaymentsByFestivalUseCase.execute(festival.id);
            paymentsData = [...paymentsData, ...festivalPayments];
          }
        } catch (err) {
          // Empty collections are okay
          console.log('No festivals or payments found yet');
        }
      }

      const families = await getFamiliesUseCase.execute({ isActive: true }).catch(() => []);
      const festivalsData = await getUpcomingFestivalsUseCase.execute(100).catch(() => []);

      const familyMap = new Map(families.map((f) => [f.id, f]));
      const festivalMap = new Map(festivalsData.map((f) => [f.id, f]));

      setPayments(paymentsData);
      setFamiliesMap(familyMap);
      setFestivalsMap(festivalMap);
    } catch (err) {
      console.error('Failed to load payments:', err);
      // Don't show error for empty collections
      setPayments([]);
    } finally {
      setLoading(false);
    }
  }, [festivalId]);

  useEffect(() => {
    loadPayments();
  }, [loadPayments]);

  const filteredPayments = payments.filter(
    (p) => filterStatus === 'ALL' || p.status === filterStatus
  );

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader />
      </div>
    );
  }

  const totalAmount = filteredPayments.reduce((sum, p) => sum + p.amount, 0);
  const paidCount = filteredPayments.filter((p) => p.status === 'PAID').length;
  const unpaidCount = filteredPayments.filter((p) => p.status === 'UNPAID').length;
  const pendingCount = filteredPayments.filter((p) => p.status === 'PENDING').length;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">
          Payments {festivalId ? '(Festival)' : ''}
        </h2>
        <Link href={APP_ROUTES.PAYMENTS + '/record'}>
          <Button>Record Payment</Button>
        </Link>
      </div>

      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="bg-blue-50">
          <p className="text-sm text-gray-600">Total Amount</p>
          <p className="text-2xl font-bold text-blue-600 mt-1">
            {formatCurrency(totalAmount)}
          </p>
        </Card>
        <Card className="bg-green-50">
          <p className="text-sm text-gray-600">Paid</p>
          <p className="text-2xl font-bold text-green-600 mt-1">{paidCount}</p>
        </Card>
        <Card className="bg-red-50">
          <p className="text-sm text-gray-600">Unpaid</p>
          <p className="text-2xl font-bold text-red-600 mt-1">{unpaidCount}</p>
        </Card>
        <Card className="bg-yellow-50">
          <p className="text-sm text-gray-600">Pending</p>
          <p className="text-2xl font-bold text-yellow-600 mt-1">{pendingCount}</p>
        </Card>
      </div>

      {/* Filter Buttons */}
      <div className="flex gap-2">
        {(['ALL', 'PAID', 'UNPAID', 'PENDING'] as const).map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              filterStatus === status
                ? 'bg-primary-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Payments Table */}
      <Card>
        {filteredPayments.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-2">No payments recorded yet.</p>
            <p className="text-sm text-gray-500">
              Click "Record Payment" to add your first payment.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b">
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    Receipt
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    Family
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    Festival
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">
                    Amount
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    Date
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredPayments.map((payment) => {
                  const family = familiesMap.get(payment.familyId);
                  const festival = festivalsMap.get(payment.festivalId);
                  
                  return (
                    <tr key={payment.id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">
                        {payment.receiptNumber}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {family?.headName || 'Unknown'}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {festival?.name || 'Unknown'}
                      </td>
                      <td className="px-4 py-3 text-sm font-semibold text-right text-gray-900">
                        {formatCurrency(payment.amount)}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {formatDate(payment.paidDate)}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            payment.status === 'PAID'
                              ? 'bg-green-100 text-green-800'
                              : payment.status === 'UNPAID'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {payment.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={async () => {
                              if (family && festival) {
                                const { generatePaymentReceipt } = await import('@/features/receipts/utils/pdf-generator');
                                generatePaymentReceipt(payment, family, festival);
                              }
                            }}
                          >
                            Download PDF
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={async () => {
                              if (!confirm('Are you sure you want to delete this payment?')) return;
                              try {
                                const deletePaymentUseCase = paymentContainer.deletePaymentUseCase();
                                await deletePaymentUseCase.execute(payment.id);
                                await loadPayments();
                              } catch (err) {
                                console.error('Failed to delete payment:', err);
                                alert('Failed to delete payment');
                              }
                            }}
                          >
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};
