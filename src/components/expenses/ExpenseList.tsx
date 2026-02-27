'use client';

import React, { useEffect, useState } from 'react';
import { expenseController } from '@/controllers/expense.controller';
import { invoiceController } from '@/controllers/invoice.controller';
import { Expense, Invoice } from '@/models';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Loader } from '@/components/ui/Loader';
import { InvoiceViewer } from './InvoiceViewer';
import { formatCurrency, formatDate } from '@/utils';
import { APP_ROUTES } from '@/core/routes';
import { Eye, Download } from 'lucide-react';
import Link from 'next/link';

export const ExpenseList: React.FC = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [loadingInvoice, setLoadingInvoice] = useState<string | null>(null);

  useEffect(() => {
    const loadExpenses = async () => {
      try {
        const data = await expenseController.getAllExpenses();
        setExpenses(data);
        setError('');
      } catch (err) {
        console.error('Failed to load expenses:', err);
        const errorMsg = err instanceof Error ? err.message : 'Failed to load expenses';
        setError(errorMsg);
      } finally {
        setLoading(false);
      }
    };

    loadExpenses();
  }, []);

  const handleViewInvoice = async (expenseId: string) => {
    setLoadingInvoice(expenseId);
    try {
      const invoice = await invoiceController.getInvoiceForExpense(expenseId);
      if (invoice) {
        setSelectedInvoice(invoice);
      } else {
        alert('No invoice found for this expense.');
      }
    } catch (err) {
      console.error('Error loading invoice:', err);
      alert('Failed to load invoice.');
    } finally {
      setLoadingInvoice(null);
    }
  };

  const handleDownloadInvoice = async (expenseId: string) => {
    setLoadingInvoice(expenseId);
    try {
      const result = await invoiceController.downloadInvoiceForExpense(expenseId);
      if (result) {
        // Download the PDF
        const url = URL.createObjectURL(result.pdfBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${result.invoiceNumber}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      } else {
        alert('No invoice found for this expense.');
      }
    } catch (err) {
      console.error('Error downloading invoice:', err);
      alert('Failed to download invoice.');
    } finally {
      setLoadingInvoice(null);
    }
  };

  if (selectedInvoice) {
    return (
      <InvoiceViewer
        invoice={selectedInvoice}
        onClose={() => setSelectedInvoice(null)}
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
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">Expenses</h2>
          <Link href={APP_ROUTES.EXPENSE_RECORD}>
            <Button size="sm">Record Expense</Button>
          </Link>
        </div>
        <Card>
          <p className="text-red-600">{error}</p>
          <p className="text-gray-500 text-sm mt-2">There might be no expenses yet, or there was an error loading them.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">Expenses</h2>
        <Link href={APP_ROUTES.EXPENSE_RECORD}>
          <Button size="sm">Record Expense</Button>
        </Link>
      </div>

      {expenses.length === 0 ? (
        <Card>
          <p className="text-center text-gray-500 py-8">No expenses found</p>
        </Card>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full bg-white rounded-lg shadow">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Date</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Title</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Paid To</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Contact</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Amount</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Invoice</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((expense) => (
                <tr key={expense.id} className="border-b last:border-0 hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm">{formatDate(expense.expenseDate)}</td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-800">{expense.purpose}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{expense.paidTo}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {expense.contactNumber || '-'}
                  </td>
                  <td className="px-4 py-3 text-sm font-semibold text-red-600">
                    {formatCurrency(expense.amount)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleViewInvoice(expense.id)}
                        disabled={loadingInvoice === expense.id}
                        className="text-blue-600 hover:text-blue-800 disabled:opacity-50 flex items-center gap-1 text-sm"
                        title="View Invoice"
                      >
                        <Eye size={16} />
                        View
                      </button>
                      <button
                        onClick={() => handleDownloadInvoice(expense.id)}
                        disabled={loadingInvoice === expense.id}
                        className="text-green-600 hover:text-green-800 disabled:opacity-50 flex items-center gap-1 text-sm"
                        title="Download Invoice"
                      >
                        <Download size={16} />
                        Download
                      </button>
                    </div>
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
