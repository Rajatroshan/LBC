'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { FestivalReport, Payment, Festival, Family } from '@/core/types';
import { paymentContainer } from '../../../payments/di/payment.container';
import { familyContainer } from '../../../family/di/family.container';
import { festivalContainer } from '../../../festival/di/festival.container';
import { Card, Loader, Button } from '@/core/ui';
import { formatDate, formatCurrency } from '@/utils';
import { generatePaymentReceipt } from '@/features/receipts/utils/pdf-generator';

export const FestivalPaymentReport: React.FC<{ festivalId: string }> = ({ festivalId }) => {
  const [report, setReport] = useState<FestivalReport | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [festival, setFestival] = useState<Festival | null>(null);
  const [familiesMap, setFamiliesMap] = useState<Map<string, Family>>(new Map());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [generatingReceipt, setGeneratingReceipt] = useState<string | null>(null);

  const loadReport = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const getPaymentsByFestivalUseCase = paymentContainer.getPaymentsByFestivalUseCase();
      const getFamiliesUseCase = familyContainer.getFamiliesUseCase();
      const getUpcomingFestivalsUseCase = festivalContainer.getUpcomingFestivalsUseCase();
      
      const paymentsData = await getPaymentsByFestivalUseCase.execute(festivalId);
      const families = await getFamiliesUseCase.execute({ isActive: true });
      const festivals = await getUpcomingFestivalsUseCase.execute(100);

      const selectedFestival = festivals.find((f) => f.id === festivalId);
      if (!selectedFestival) {
        setError('Festival not found');
        setLoading(false);
        return;
      }

      const familyMap = new Map(families.map((f) => [f.id, f]));
      setFestival(selectedFestival);
      setPayments(paymentsData);
      setFamiliesMap(familyMap);

      // Generate report
      const paidPayments = paymentsData.filter((p) => p.status === 'PAID');
      const unpaidPayments = paymentsData.filter((p) => p.status === 'UNPAID');
      const pendingPayments = paymentsData.filter((p) => p.status === 'PENDING');

      const totalAmount = paymentsData.reduce((sum, p) => sum + p.amount, 0);
      const collectedAmount = paidPayments.reduce((sum, p) => sum + p.amount, 0);
      const pendingAmount = totalAmount - collectedAmount;

      const report: FestivalReport = {
        festivalId: selectedFestival.id,
        festivalName: selectedFestival.name,
        festivalDate: selectedFestival.date,
        totalFamilies: families.length,
        paidFamilies: paidPayments.length,
        unpaidFamilies: unpaidPayments.length + pendingPayments.length,
        totalAmount,
        collectedAmount,
        pendingAmount,
        payments: paymentsData.map((p) => ({
          familyName: familyMap.get(p.familyId)?.headName || 'Unknown',
          amount: p.amount,
          paidDate: p.paidDate,
          status: p.status,
        })),
      };

      setReport(report);
    } catch (err) {
      console.error('Failed to load report:', err);
      setError('Could not load festival report. Please check your connection.');
    } finally {
      setLoading(false);
    }
  }, [festivalId]);

  useEffect(() => {
    loadReport();
  }, [loadReport]);

  const handleGenerateReceipt = async (paymentId: string) => {
    const payment = payments.find((p) => p.id === paymentId);
    const family = Array.from(familiesMap.values()).find((f) =>
      payments.find((p) => p.id === paymentId && p.familyId === f.id)
    );

    if (payment && family && festival) {
      setGeneratingReceipt(paymentId);
      try {
        generatePaymentReceipt(payment, family, festival);
      } catch (err) {
        console.error('Failed to generate receipt:', err);
      } finally {
        setGeneratingReceipt(null);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader />
      </div>
    );
  }

  if (error || !report || !festival) {
    return (
      <Card>
        <p className="text-red-600">{error || 'Report not found'}</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Card */}
      <Card>
        <div className="mb-4">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">{report.festivalName}</h2>
          <p className="text-sm text-gray-600">{formatDate(report.festivalDate)}</p>
        </div>

        <div className="grid gap-4 md:grid-cols-5">
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Total Families</p>
            <p className="text-2xl font-bold text-blue-600">{report.totalFamilies}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Paid</p>
            <p className="text-2xl font-bold text-green-600">{report.paidFamilies}</p>
          </div>
          <div className="bg-red-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Unpaid</p>
            <p className="text-2xl font-bold text-red-600">{report.unpaidFamilies}</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Total Expected</p>
            <p className="text-2xl font-bold text-purple-600">
              {formatCurrency(report.totalAmount)}
            </p>
          </div>
          <div>
            <div className="bg-green-50 p-4 rounded-lg mb-2">
              <p className="text-sm text-gray-600 mb-1">Collected</p>
              <p className="text-lg font-bold text-green-600">
                {formatCurrency(report.collectedAmount)}
              </p>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Pending</p>
              <p className="text-lg font-bold text-red-600">
                {formatCurrency(report.pendingAmount)}
              </p>
            </div>
          </div>
        </div>

        {/* Collection Percentage */}
        <div className="mt-6">
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Collection Rate</span>
            <span className="text-sm font-bold text-gray-900">
              {report.totalAmount > 0
                ? Math.round((report.collectedAmount / report.totalAmount) * 100)
                : 0}
              %
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-green-600 h-3 rounded-full transition-all duration-300"
              style={{
                width:
                  report.totalAmount > 0
                    ? `${(report.collectedAmount / report.totalAmount) * 100}%`
                    : '0%',
              }}
            />
          </div>
        </div>
      </Card>

      {/* Payments Table */}
      <Card>
        <h3 className="text-xl font-bold text-gray-800 mb-4">Payment Details</h3>
        {payments.length === 0 ? (
          <p className="text-center text-gray-600 py-8">No payments recorded</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b">
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    Family
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
                    Receipt
                  </th>
                </tr>
              </thead>
              <tbody>
                {payments.map((payment) => (
                  <tr key={payment.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {familiesMap.get(payment.familyId)?.headName || 'Unknown'}
                    </td>
                    <td className="px-4 py-3 text-sm font-semibold text-right text-gray-900">
                      {formatCurrency(payment.amount)}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {formatDate(payment.paidDate)}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span
                        className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
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
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleGenerateReceipt(payment.id)}
                        disabled={generatingReceipt === payment.id}
                      >
                        {generatingReceipt === payment.id ? 'Generating...' : 'PDF'}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};
