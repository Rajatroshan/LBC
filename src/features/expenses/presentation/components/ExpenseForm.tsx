'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Input, Card, Loader, Textarea } from '@/core/ui';
import { Festival } from '@/core/types';
import { expenseContainer } from '../../di/expense.container';
import { festivalContainer } from '../../../festival/di/festival.container';
import { APP_ROUTES } from '@/core/routes';

export const ExpenseForm: React.FC = () => {
  const [purpose, setPurpose] = useState('');
  const [category, setCategory] = useState<'TENT' | 'FOOD' | 'DECORATION' | 'ENTERTAINMENT' | 'UTILITIES' | 'OTHER'>('OTHER');
  const [amount, setAmount] = useState('');
  const [expenseDate, setExpenseDate] = useState(new Date().toISOString().split('T')[0]);
  const [paidTo, setPaidTo] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [selectedFestival, setSelectedFestival] = useState('');
  const [notes, setNotes] = useState('');
  const [festivals, setFestivals] = useState<Festival[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const router = useRouter();
  const createExpenseUseCase = expenseContainer.createExpenseUseCase();
  const getFestivalsUseCase = festivalContainer.getFestivalsUseCase();

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError('');
      try {
        const festivalsData = await getFestivalsUseCase.execute();
        setFestivals(festivalsData);
      } catch (err) {
        console.error('Failed to load festivals:', err);
        setError('Could not load festivals.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [getFestivalsUseCase]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!purpose || !amount || !paidTo) {
      setError('Please fill in all required fields');
      return;
    }

    setSubmitting(true);

    try {
      await createExpenseUseCase.execute({
        purpose,
        category,
        amount: parseFloat(amount),
        expenseDate: new Date(expenseDate),
        paidTo,
        contactNumber: contactNumber || undefined,
        festivalId: selectedFestival || undefined,
        notes: notes || undefined,
      });

      router.push(APP_ROUTES.PAYMENTS);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error.message || 'Failed to record expense');
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

  return (
    <Card>
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Record Expense</h2>
      <p className="text-sm text-gray-600 mb-4">
        Track outgoing payments for events (tent, food, decoration, etc.)
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <Input
          label="Purpose *"
          value={purpose}
          onChange={(e) => setPurpose(e.target.value)}
          placeholder="e.g., Tent rental, Food catering"
          required
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category *
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as 'TENT' | 'FOOD' | 'DECORATION' | 'ENTERTAINMENT' | 'UTILITIES' | 'OTHER')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            required
          >
            <option value="TENT">Tent</option>
            <option value="FOOD">Food</option>
            <option value="DECORATION">Decoration</option>
            <option value="ENTERTAINMENT">Entertainment</option>
            <option value="UTILITIES">Utilities</option>
            <option value="OTHER">Other</option>
          </select>
        </div>

        <Input
          label="Amount (₹) *"
          type="number"
          step="0.01"
          min="0"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter amount"
          required
        />

        <Input
          label="Paid To *"
          value={paidTo}
          onChange={(e) => setPaidTo(e.target.value)}
          placeholder="Vendor/Person name"
          required
        />

        <Input
          label="Contact Number"
          value={contactNumber}
          onChange={(e) => setContactNumber(e.target.value)}
          placeholder="Vendor contact (optional)"
        />

        <Input
          label="Expense Date *"
          type="date"
          value={expenseDate}
          onChange={(e) => setExpenseDate(e.target.value)}
          required
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Related Festival (Optional)
          </label>
          <select
            value={selectedFestival}
            onChange={(e) => setSelectedFestival(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="">-- Not related to any festival --</option>
            {festivals.map((festival) => (
              <option key={festival.id} value={festival.id}>
                {festival.name}
              </option>
            ))}
          </select>
        </div>

        <Textarea
          label="Notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Additional notes (optional)"
          rows={3}
        />

        <div className="flex gap-3 mt-6">
          <Button type="submit" disabled={submitting}>
            {submitting ? 'Recording...' : 'Record Expense'}
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
