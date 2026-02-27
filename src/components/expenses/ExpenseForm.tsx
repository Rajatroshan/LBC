'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { expenseController } from '@/controllers/expense.controller';
import { festivalController } from '@/controllers/festival.controller';
import { Festival } from '@/models';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Loader } from '@/components/ui/Loader';
import { APP_ROUTES } from '@/core/routes';
import { ExpenseCategory } from '@shared/constants';

export const ExpenseForm: React.FC = () => {
  const [purpose, setPurpose] = useState('');
  const [category, setCategory] = useState<string>(ExpenseCategory.OTHER);
  const [amount, setAmount] = useState(0);
  const [expenseDate, setExpenseDate] = useState(new Date().toISOString().split('T')[0]);
  const [paidTo, setPaidTo] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [festivalId, setFestivalId] = useState('');
  const [notes, setNotes] = useState('');
  const [festivals, setFestivals] = useState<Festival[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const loadFestivals = async () => {
      try {
        const data = await festivalController.getAllFestivals();
        setFestivals(data);
      } catch (err) {
        console.error('Failed to load festivals:', err);
      } finally {
        setLoadingData(false);
      }
    };

    loadFestivals();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await expenseController.createExpense({
        purpose,
        category: category as 'TENT' | 'FOOD' | 'DECORATION' | 'ENTERTAINMENT' | 'UTILITIES' | 'OTHER',
        amount,
        expenseDate: new Date(expenseDate),
        paidTo,
        contactNumber: contactNumber || undefined,
        festivalId: festivalId || undefined,
        notes: notes || undefined,
      });
      router.push(APP_ROUTES.PAYMENTS);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to record expense');
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <div className="flex justify-center py-12">
        <Loader />
      </div>
    );
  }

  return (
    <Card>
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label="Purpose"
          value={purpose}
          onChange={(e) => setPurpose(e.target.value)}
          placeholder="Enter expense purpose"
          required
        />

        <div className="w-full">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category <span className="text-red-500 ml-1">*</span>
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            required
          >
            {Object.values(ExpenseCategory).map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <Input
          label="Amount (₹)"
          type="number"
          value={amount.toString()}
          onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
          min="0"
          required
        />

        <Input
          label="Expense Date"
          type="date"
          value={expenseDate}
          onChange={(e) => setExpenseDate(e.target.value)}
          required
        />

        <Input
          label="Paid To"
          value={paidTo}
          onChange={(e) => setPaidTo(e.target.value)}
          placeholder="Enter recipient name"
          required
        />

        <Input
          label="Contact Number"
          type="tel"
          value={contactNumber}
          onChange={(e) => setContactNumber(e.target.value)}
          placeholder="Enter contact number (optional)"
        />

        <div className="w-full">
          <label className="block text-sm font-medium text-gray-700 mb-1">Festival (Optional)</label>
          <select
            value={festivalId}
            onChange={(e) => setFestivalId(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="">No Festival</option>
            {festivals.map((f) => (
              <option key={f.id} value={f.id}>{f.name}</option>
            ))}
          </select>
        </div>

        <Textarea
          label="Notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Any additional notes (optional)"
          rows={3}
        />

        <div className="flex gap-4">
          <Button type="submit" isLoading={loading} disabled={loading}>
            Record Expense
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
