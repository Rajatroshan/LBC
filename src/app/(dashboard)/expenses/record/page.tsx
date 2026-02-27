'use client';

import { ExpenseForm } from '@/components/expenses/ExpenseForm';

export default function RecordExpensePage() {
  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Record Expense</h1>
      <ExpenseForm />
    </div>
  );
}
