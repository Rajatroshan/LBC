'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { paymentController } from '@/controllers/payment.controller';
import { familyController } from '@/controllers/family.controller';
import { festivalController } from '@/controllers/festival.controller';
import { Payment, Family, Festival } from '@/models';
import { Card } from '@/components/ui/Card';
import { Loader } from '@/components/ui/Loader';
import { formatCurrency, formatDate } from '@/utils';

interface FestivalPaymentReportProps {
  festivalId: string;
}

export const FestivalPaymentReport: React.FC<FestivalPaymentReportProps> = ({ festivalId }) => {
  const [festival, setFestival] = useState<Festival | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [families, setFamilies] = useState<Family[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadReport = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [festivalData, paymentsData, familiesData] = await Promise.all([
        festivalController.getFestivalById(festivalId),
        paymentController.getPaymentsByFestival(festivalId),
        familyController.getAllFamilies({ isActive: true }),
      ]);

      setFestival(festivalData);
      setPayments(paymentsData);
      setFamilies(familiesData);
    } catch (err) {
      console.error('Failed to load report:', err);
      setError('Failed to load report data');
    } finally {
      setLoading(false);
    }
  }, [festivalId]);

  useEffect(() => {
    loadReport();
  }, [loadReport]);

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader size="lg" />
      </div>
    );
  }

  if (error || !festival) {
    return (
      <Card>
        <p className="text-red-600">{error || 'Festival not found'}</p>
      </Card>
    );
  }

  const paidFamilyIds = new Set(payments.filter((p) => p.status === 'PAID').map((p) => p.familyId));
  const paidCount = paidFamilyIds.size;
  const unpaidCount = families.length - paidCount;
  const totalExpected = families.length * festival.amountPerFamily;
  const totalCollected = payments.filter(p => p.status === 'PAID').reduce((sum, p) => sum + p.amount, 0);
  const pendingAmount = totalExpected - totalCollected;

  return (
    <div className="space-y-6">
      {/* Festival Info */}
      <Card>
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Payment Report: {festival.name}
        </h1>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-gray-500">Total Families</p>
            <p className="text-2xl font-bold text-blue-600">{families.length}</p>
          </div>
          <div className="p-3 bg-green-50 rounded-lg">
            <p className="text-sm text-gray-500">Paid</p>
            <p className="text-2xl font-bold text-green-600">{paidCount}</p>
          </div>
          <div className="p-3 bg-red-50 rounded-lg">
            <p className="text-sm text-gray-500">Unpaid</p>
            <p className="text-2xl font-bold text-red-600">{unpaidCount}</p>
          </div>
          <div className="p-3 bg-purple-50 rounded-lg">
            <p className="text-sm text-gray-500">Amount Per Family</p>
            <p className="text-2xl font-bold text-purple-600">{formatCurrency(festival.amountPerFamily)}</p>
          </div>
        </div>
      </Card>

      {/* Collection Summary */}
      <Card>
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Collection Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 border rounded-lg">
            <p className="text-sm text-gray-500">Expected</p>
            <p className="text-xl font-bold text-gray-800">{formatCurrency(totalExpected)}</p>
          </div>
          <div className="p-4 border rounded-lg">
            <p className="text-sm text-gray-500">Collected</p>
            <p className="text-xl font-bold text-green-600">{formatCurrency(totalCollected)}</p>
          </div>
          <div className="p-4 border rounded-lg">
            <p className="text-sm text-gray-500">Pending</p>
            <p className="text-xl font-bold text-red-600">{formatCurrency(pendingAmount)}</p>
          </div>
        </div>
      </Card>

      {/* Family Payment Details */}
      <Card>
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Family-wise Status</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="text-left px-4 py-3 font-medium text-gray-500">Family</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Phone</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Status</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Amount Paid</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Date</th>
              </tr>
            </thead>
            <tbody>
              {families.map((family) => {
                const payment = payments.find(
                  (p) => p.familyId === family.id && p.status === 'PAID'
                );
                return (
                  <tr key={family.id} className="border-b last:border-0">
                    <td className="px-4 py-3 font-medium">{family.headName}</td>
                    <td className="px-4 py-3 text-gray-500">{family.phone}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        payment ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {payment ? 'PAID' : 'UNPAID'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {payment ? formatCurrency(payment.amount) : '-'}
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      {payment ? formatDate(payment.paidDate) : '-'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
