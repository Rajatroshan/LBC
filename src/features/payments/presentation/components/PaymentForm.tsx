'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Input, Card, Loader, Textarea } from '@/core/ui';
import { Family, Festival } from '@/core/types';
import { paymentContainer } from '../../di/payment.container';
import { familyContainer } from '../../../family/di/family.container';
import { festivalContainer } from '../../../festival/di/festival.container';
import { generatePaymentReceipt } from '@/features/receipts/utils/pdf-generator';
import { APP_ROUTES } from '@/core/routes';

export const PaymentForm: React.FC = () => {
  const [families, setFamilies] = useState<Family[]>([]);
  const [festivals, setFestivals] = useState<Festival[]>([]);
  const [selectedFamily, setSelectedFamily] = useState('');
  const [selectedFestival, setSelectedFestival] = useState('');
  const [amount, setAmount] = useState('');
  const [paidDate, setPaidDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState<'PAID' | 'UNPAID' | 'PENDING'>('PAID');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [searchFamily, setSearchFamily] = useState('');

  const router = useRouter();

  const loadData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const getFamiliesUseCase = familyContainer.getFamiliesUseCase();
      const getUpcomingFestivalsUseCase = festivalContainer.getUpcomingFestivalsUseCase();
      
      const familiesData = await getFamiliesUseCase.execute({ isActive: true });
      const festivalsData = await getUpcomingFestivalsUseCase.execute(50);
      setFamilies(familiesData);
      setFestivals(festivalsData);
    } catch (err) {
      console.error('Failed to load payment form data:', err);
      setError('Could not load families or festivals. Please check your connection.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Auto-fill amount when festival is selected
  const handleFestivalChange = (festivalId: string) => {
    setSelectedFestival(festivalId);
    const festival = festivals.find((f) => f.id === festivalId);
    if (festival) {
      setAmount(festival.amountPerFamily.toString());
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!selectedFamily || !selectedFestival || !amount) {
      setError('Please fill in all required fields');
      return;
    }

    setSubmitting(true);

    try {
      const recordPaymentUseCase = paymentContainer.recordPaymentUseCase();
      const payment = await recordPaymentUseCase.execute({
        familyId: selectedFamily,
        festivalId: selectedFestival,
        amount: parseFloat(amount),
        paidDate: new Date(paidDate),
        status,
        notes: notes || undefined,
      });

      // Generate PDF receipt if payment is marked as PAID
      if (status === 'PAID') {
        const family = families.find((f) => f.id === selectedFamily);
        const festival = festivals.find((f) => f.id === selectedFestival);
        if (family && festival) {
          generatePaymentReceipt(payment, family, festival);
        }
      }

      router.push(APP_ROUTES.PAYMENTS);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error.message || 'Failed to record payment');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <div className="flex justify-center py-12">
          <Loader />
        </div>
      </Card>
    );
  }

  // Filter families based on search
  const filteredFamilies = families.filter((family) =>
    family.headName.toLowerCase().includes(searchFamily.toLowerCase()) ||
    family.phone.includes(searchFamily)
  );

  return (
    <Card>
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Record Payment (Chanda)</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Search Family
          </label>
          <Input
            value={searchFamily}
            onChange={(e) => setSearchFamily(e.target.value)}
            placeholder="Search by name or phone..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Select Family *
          </label>
          <select
            value={selectedFamily}
            onChange={(e) => setSelectedFamily(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            required
          >
            <option value="">-- Choose a family --</option>
            {filteredFamilies.map((family) => (
              <option key={family.id} value={family.id}>
                {family.headName} - {family.phone} ({family.members} members)
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Select Festival *
          </label>
          <select
            value={selectedFestival}
            onChange={(e) => handleFestivalChange(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            required
          >
            <option value="">-- Choose a festival --</option>
            {festivals.map((festival) => (
              <option key={festival.id} value={festival.id}>
                {festival.name} (₹{festival.amountPerFamily})
              </option>
            ))}
          </select>
        </div>

        <Input
          label="Amount Paid (₹) *"
          type="number"
          step="0.01"
          min="0"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter amount"
          required
        />

        <Input
          label="Payment Date *"
          type="date"
          value={paidDate}
          onChange={(e) => setPaidDate(e.target.value)}
          required
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Payment Status *
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as 'PAID' | 'UNPAID' | 'PENDING')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            required
          >
            <option value="PAID">Paid</option>
            <option value="PENDING">Pending</option>
            <option value="UNPAID">Unpaid</option>
          </select>
        </div>

        <Textarea
          label="Notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Additional notes (optional)"
          rows={3}
        />

        <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
          <p className="text-sm text-blue-800">
            📄 A PDF receipt will be automatically generated for payments marked as &quot;Paid&quot;
          </p>
        </div>

        <div className="flex gap-3 mt-6">
          <Button type="submit" disabled={submitting}>
            {submitting ? 'Recording...' : 'Record Payment'}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push(APP_ROUTES.PAYMENTS)}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Card>
  );
};
