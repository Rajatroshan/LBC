'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { Expense, Festival } from '@/core/types';
import { expenseContainer } from '../../di/expense.container';
import { festivalContainer } from '../../../festival/di/festival.container';
import { Card, Button, Loader } from '@/core/ui';
import { formatDate, formatCurrency } from '@/utils';
import Link from 'next/link';

export const ExpenseList: React.FC<{ festivalId?: string }> = ({ festivalId }) => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [festivalsMap, setFestivalsMap] = useState<Map<string, Festival>>(new Map());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('ALL');

  const loadExpenses = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const getExpensesUseCase = expenseContainer.getExpensesUseCase();
      const getFestivalsUseCase = festivalContainer.getFestivalsUseCase();
      
      const filter = festivalId ? { festivalId } : {};
      const expensesData = await getExpensesUseCase.execute(filter).catch(() => []);
      const festivalsData = await getFestivalsUseCase.execute().catch(() => []);

      const festivalMap = new Map(festivalsData.map((f) => [f.id, f]));

      setExpenses(expensesData);
      setFestivalsMap(festivalMap);
    } catch (err) {
      console.error('Failed to load expenses:', err);
      // Don't show error for empty collections
      setExpenses([]);
    } finally {
      setLoading(false);
    }
  }, [festivalId]);

  useEffect(() => {
    loadExpenses();
  }, [loadExpenses]);

  const handleDelete = async (id: string, purpose: string) => {
    if (!confirm(`Are you sure you want to delete the expense "${purpose}"?`)) {
      return;
    }

    try {
      const deleteExpenseUseCase = expenseContainer.deleteExpenseUseCase();
      await deleteExpenseUseCase.execute(id);
      await loadExpenses();
    } catch (err) {
      console.error('Failed to delete expense:', err);
      alert('Failed to delete expense');
    }
  };

  const filteredExpenses = expenses.filter(
    (e) => filterCategory === 'ALL' || e.category === filterCategory
  );

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader />
      </div>
    );
  }

  const totalExpenses = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">
          Expenses {festivalId ? '(Festival)' : ''}
        </h2>
        <Link href="/expenses/record">
          <Button>Record Expense</Button>
        </Link>
      </div>

      {/* Summary Stats */}
      <Card className="bg-red-50">
        <p className="text-sm text-gray-600">Total Expenses</p>
        <p className="text-2xl font-bold text-red-600 mt-1">
          {formatCurrency(totalExpenses)}
        </p>
      </Card>

      {/* Filter Buttons */}
      <div className="flex gap-2 flex-wrap">
        {(['ALL', 'TENT', 'FOOD', 'DECORATION', 'ENTERTAINMENT', 'UTILITIES', 'OTHER'] as const).map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className={`px-4 py-2 rounded-lg font-medium transition text-sm ${
              filterCategory === cat
                ? 'bg-primary-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Expenses Table */}
      <Card>
        {filteredExpenses.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-2">No expenses recorded yet.</p>
            <p className="text-sm text-gray-500">
              Click "Record Expense" to track your first expense.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b">
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    Purpose
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    Category
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    Paid To
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">
                    Amount
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    Date
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    Festival
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredExpenses.map((expense) => (
                  <tr key={expense.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">
                      {expense.purpose}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {expense.category}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {expense.paidTo}
                      {expense.contactNumber && (
                        <div className="text-xs text-gray-500">{expense.contactNumber}</div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm font-semibold text-right text-red-600">
                      -{formatCurrency(expense.amount)}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {formatDate(expense.expenseDate)}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {expense.festivalId
                        ? festivalsMap.get(expense.festivalId)?.name || 'Unknown'
                        : '-'}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(expense.id, expense.purpose)}
                      >
                        Delete
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
