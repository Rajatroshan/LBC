'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { expenseController } from '@/controllers/expense.controller';
import { invoiceController } from '@/controllers/invoice.controller';
import { festivalController } from '@/controllers/festival.controller';
import { Festival, PaymentSourceType } from '@/models';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Loader } from '@/components/ui/Loader';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { APP_ROUTES } from '@/core/routes';
import { ExpenseCategory, EXPENSE_CATEGORY_LABELS, PAYMENT_SOURCES } from '@/constants';
import { sanitizePhone } from '@/utils/validation';
import { Landmark, UserCheck, Wallet, ShieldCheck, Clock } from 'lucide-react';

export const ExpenseForm: React.FC = () => {
  const { user, isAdmin } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  const [purpose, setPurpose] = useState('');
  const [category, setCategory] = useState<string>(ExpenseCategory.OTHER);
  const [amount, setAmount] = useState(0);
  const [expenseDate, setExpenseDate] = useState(new Date().toISOString().split('T')[0]);
  const [paidTo, setPaidTo] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [festivalId, setFestivalId] = useState('');
  const [notes, setNotes] = useState('');
  
  // Set default payment source based on admin role
  const [paymentSource, setPaymentSource] = useState<PaymentSourceType>(
    isAdmin ? PAYMENT_SOURCES.MASTER_ACCOUNT : PAYMENT_SOURCES.PERSONAL_OUT_OF_POCKET
  );

  const [festivals, setFestivals] = useState<Festival[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState('');
  const [generatingInvoice, setGeneratingInvoice] = useState(false);

  useEffect(() => {
    const loadFestivals = async () => {
      try {
        const data = await festivalController.getAllFestivals();
        setFestivals(data);
      } catch (err) {
        console.error('Failed to load festivals:', err);
        toast.error('Failed to load festivals list', 'Loading Error');
      } finally {
        setLoadingData(false);
      }
    };

    loadFestivals();
  }, [toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const expense = await expenseController.createExpense({
        purpose,
        category: category as 'TENT' | 'FOOD' | 'DECORATION' | 'ENTERTAINMENT' | 'UTILITIES' | 'TRANSPORT' | 'SOUND_LIGHT' | 'PRIEST' | 'OTHER',
        amount,
        expenseDate: new Date(expenseDate),
        paidTo,
        contactNumber: contactNumber || undefined,
        festivalId: festivalId || undefined,
        notes: notes || undefined,
        paymentSource,
        paidByUserId: user?.id,
        paidByUserName: user?.name,
        paidByUserEmail: user?.email,
        isAdmin: isAdmin === true,
      });

      setLoading(false);

      // Generate invoice with UI feedback
      if (user?.id) {
        setGeneratingInvoice(true);
        try {
          const { invoice, pdfBlob } = await invoiceController.generateInvoiceForExpense(
            expense.id,
            user.id
          );
          
          // Download PDF immediately
          const url = URL.createObjectURL(pdfBlob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `${invoice.invoiceNumber}.pdf`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
          
          if (paymentSource === PAYMENT_SOURCES.PERSONAL_OUT_OF_POCKET) {
            toast.success(
              `Expense recorded as Out-of-Pocket!\nLogged to your personal ledger (Claimable under Reimbursements).`, 
              'Out-of-Pocket Logged'
            );
            router.push(APP_ROUTES.REIMBURSEMENTS);
          } else if (!isAdmin) {
            toast.success(
              `Master Account expense submitted for Admin Approval!\nInvoice ${invoice.invoiceNumber} downloaded. Funds will be deducted once verified.`,
              'Awaiting Admin Approval'
            );
            router.push(APP_ROUTES.REIMBURSEMENTS);
          } else {
            toast.success(
              `Expense disbursed directly from Club Master Account!\nInvoice ${invoice.invoiceNumber} downloaded.`, 
              'Master Account Disbursed'
            );
            router.push(APP_ROUTES.PAYMENTS);
          }
        } catch (invoiceError) {
          console.error('Failed to generate invoice:', invoiceError);
          setGeneratingInvoice(false);
          const errorMessage = invoiceError instanceof Error 
            ? invoiceError.message 
            : 'Unknown error occurred';
          toast.warning(`Expense recorded, but invoice generation failed: ${errorMessage}`, 'Invoice Warning');
          router.push(APP_ROUTES.REIMBURSEMENTS);
        } finally {
          setGeneratingInvoice(false);
        }
      } else {
        toast.success('Expense recorded successfully!', 'Expense Recorded');
        router.push(APP_ROUTES.REIMBURSEMENTS);
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to record expense');
      setError(error.message);
      toast.error(error.message, 'Expense Failed');
      setLoading(false);
      setGeneratingInvoice(false);
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Record Vendor Expense</h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            Record supplier, decoration, food, or operational costs
          </p>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">
          {isAdmin ? (
            <span className="flex items-center gap-1 text-emerald-700">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Admin (Direct Payout Authorized)
            </span>
          ) : (
            <span className="flex items-center gap-1 text-amber-700">
              <Clock className="w-4 h-4 text-amber-600" />
              Member (Approval Workflow)
            </span>
          )}
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Payment Source Selection */}
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl space-y-3">
          <label className="block text-sm font-semibold text-gray-800">
            Payment Source / Paid By <span className="text-red-500">*</span>
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Option 1: Club Master Account */}
            <label
              className={`flex items-start gap-3 p-3.5 rounded-lg border cursor-pointer transition-all ${
                paymentSource === PAYMENT_SOURCES.MASTER_ACCOUNT
                  ? 'border-primary-500 bg-primary-50/70 text-primary-900 shadow-xs'
                  : 'border-gray-200 bg-white hover:bg-gray-100 text-gray-700'
              }`}
            >
              <input
                type="radio"
                name="paymentSource"
                value={PAYMENT_SOURCES.MASTER_ACCOUNT}
                checked={paymentSource === PAYMENT_SOURCES.MASTER_ACCOUNT}
                onChange={() => setPaymentSource(PAYMENT_SOURCES.MASTER_ACCOUNT)}
                className="w-4 h-4 mt-0.5 text-primary-600 focus:ring-primary-500"
              />
              <div className="flex flex-col">
                <span className="text-sm font-semibold flex items-center gap-1.5">
                  <Landmark className="w-4 h-4 text-primary-600" />
                  Club Master Account
                </span>
                <span className="text-xs text-gray-500 mt-0.5">
                  {isAdmin 
                    ? 'Direct deduction from treasury (No approval needed)' 
                    : 'Request club payment (Requires Admin approval before deduction)'}
                </span>
              </div>
            </label>

            {/* Option 2: Paid Out-of-Pocket */}
            <label
              className={`flex items-start gap-3 p-3.5 rounded-lg border cursor-pointer transition-all ${
                paymentSource === PAYMENT_SOURCES.PERSONAL_OUT_OF_POCKET
                  ? 'border-amber-500 bg-amber-50/70 text-amber-900 shadow-xs'
                  : 'border-gray-200 bg-white hover:bg-gray-100 text-gray-700'
              }`}
            >
              <input
                type="radio"
                name="paymentSource"
                value={PAYMENT_SOURCES.PERSONAL_OUT_OF_POCKET}
                checked={paymentSource === PAYMENT_SOURCES.PERSONAL_OUT_OF_POCKET}
                onChange={() => setPaymentSource(PAYMENT_SOURCES.PERSONAL_OUT_OF_POCKET)}
                className="w-4 h-4 mt-0.5 text-amber-600 focus:ring-amber-500"
              />
              <div className="flex flex-col">
                <span className="text-sm font-semibold flex items-center gap-1.5">
                  <Wallet className="w-4 h-4 text-amber-600" />
                  Paid Out-of-Pocket (My Money)
                </span>
                <span className="text-xs text-gray-500 mt-0.5">
                  Paid from personal pocket. Logged to your ledger & claimable for reimbursement
                </span>
              </div>
            </label>
          </div>

          {/* Context Guidance */}
          {paymentSource === PAYMENT_SOURCES.PERSONAL_OUT_OF_POCKET ? (
            <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800 flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                <strong>Out-of-Pocket Workflow:</strong> Logged into your personal ledger ({user?.name || 'Member'}). You can raise a money request from the <strong>Reimbursements</strong> page anytime to receive approval and payout from the central treasury.
              </span>
            </div>
          ) : !isAdmin ? (
            <div className="p-2.5 bg-sky-50 border border-sky-200 rounded-lg text-xs text-sky-800 flex items-center gap-2">
              <Clock className="w-4 h-4 text-sky-600 shrink-0" />
              <span>
                <strong>Master Account Request:</strong> This will be submitted to the Admin Approvals Queue. Treasury funds will be deducted once verified and approved by an Admin.
              </span>
            </div>
          ) : (
            <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                <strong>Direct Treasury Disbursement:</strong> As an Admin, the amount will be immediately deducted from the Club Master Account.
              </span>
            </div>
          )}
        </div>

        <Input
          label="Expense Title / Item"
          value={purpose}
          onChange={(e) => setPurpose(e.target.value)}
          placeholder="e.g., DJ Service, Lights, Catering, Decoration"
          required
        />

        <Input
          label="Amount (₹)"
          type="number"
          value={amount.toString()}
          onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
          min="1"
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
          label="Paid To (Vendor / Contractor Name)"
          value={paidTo}
          onChange={(e) => setPaidTo(e.target.value)}
          placeholder="Enter vendor/recipient name"
          required
        />

        <Input
          label="Contact Number"
          type="tel"
          value={contactNumber}
          onChange={(e) => setContactNumber(sanitizePhone(e.target.value))}
          placeholder="Enter contact number (optional)"
          maxLength={15}
          pattern="[0-9]*"
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category <span className="text-red-500">*</span>
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm font-medium"
            required
          >
            {Object.entries(ExpenseCategory).map(([key, value]) => (
              <option key={key} value={value}>
                {EXPENSE_CATEGORY_LABELS[value] || value}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Associated Festival (Optional)
          </label>
          <select
            value={festivalId}
            onChange={(e) => setFestivalId(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
          >
            <option value="">General Expense (Not tied to a festival)</option>
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
          placeholder="Enter additional details, items list, or bill notes (optional)"
          rows={3}
        />

        <div className="flex gap-4">
          <Button type="submit" isLoading={loading || generatingInvoice} disabled={loading || generatingInvoice}>
            {generatingInvoice ? 'Generating Invoice...' : 'Record Expense'}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push(APP_ROUTES.REIMBURSEMENTS)}
            disabled={loading || generatingInvoice}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Card>
  );
};
