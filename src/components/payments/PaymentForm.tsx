'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { paymentController } from '@/controllers/payment.controller';
import { familyController } from '@/controllers/family.controller';
import { festivalController } from '@/controllers/festival.controller';
import { Family, Festival } from '@/models';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Loader } from '@/components/ui/Loader';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { APP_ROUTES } from '@/core/routes';
import { ShieldCheck, UserCheck, Receipt, Clock } from 'lucide-react';

export const PaymentForm: React.FC = () => {
  const [familyId, setFamilyId] = useState('');
  const [festivalId, setFestivalId] = useState('');
  const [amount, setAmount] = useState(0);
  const [paidDate, setPaidDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');
  const [families, setFamilies] = useState<Family[]>([]);
  const [festivals, setFestivals] = useState<Festival[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState('');
  const [generatingReceipt, setGeneratingReceipt] = useState(false);
  const router = useRouter();
  const { user, isAdmin } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const loadData = async () => {
      try {
        const [familiesData, festivalsData] = await Promise.all([
          familyController.getAllFamilies({ isActive: true }),
          festivalController.getAllFestivals({ isActive: true }),
        ]);
        setFamilies(familiesData);
        setFestivals(festivalsData);
      } catch (err) {
        console.error('Failed to load data:', err);
        setError('Failed to load families and festivals');
        toast.error('Failed to load families and festivals', 'Data Loading Error');
      } finally {
        setLoadingData(false);
      }
    };

    loadData();
  }, [toast]);

  const handleFestivalChange = (id: string) => {
    setFestivalId(id);
    const festival = festivals.find((f) => f.id === id);
    if (festival) {
      setAmount(festival.amountPerFamily);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Create payment
      const payment = await paymentController.createPayment({
        familyId,
        festivalId,
        amount,
        paidDate: new Date(paidDate),
        notes: notes || undefined,
        generateReceipt: false,
        generatedBy: user?.id,
        isAdmin: isAdmin === true,
        submittedByUserId: user?.id,
        submittedByUserName: user?.name,
      });

      setLoading(false);

      // Generate receipt / payslip with UI feedback
      if (user?.id) {
        setGeneratingReceipt(true);
        try {
          const { receipt, pdfBlob } = await paymentController.generateReceiptWithoutStorage(
            payment.id,
            user.id,
            user.name
          );
          
          // Download PDF immediately
          const url = URL.createObjectURL(pdfBlob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `${receipt.receiptNumber}.pdf`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
          
          if (isAdmin) {
            toast.success(
              `Payment verified & recorded successfully!\nOfficial Receipt ${receipt.receiptNumber} downloaded.`, 
              'Payment Verified'
            );
          } else {
            toast.success(
              `Payment recorded & submitted for Admin verification!\nProvisional Slip ${receipt.receiptNumber} downloaded.`, 
              'Provisional Slip Issued'
            );
          }
          router.push(APP_ROUTES.PAYMENTS);
        } catch (receiptError) {
          console.error('Failed to generate receipt:', receiptError);
          setGeneratingReceipt(false);
          const errorMessage = receiptError instanceof Error 
            ? receiptError.message 
            : 'Unknown error occurred';
          toast.warning(`Payment recorded, but receipt generation failed: ${errorMessage}`, 'Receipt Warning');
          router.push(APP_ROUTES.PAYMENTS);
        } finally {
          setGeneratingReceipt(false);
        }
      } else {
        toast.success('Payment recorded successfully!', 'Payment Recorded');
        router.push(APP_ROUTES.PAYMENTS);
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to record payment');
      console.error('Payment error:', error);
      setError(error.message);
      toast.error(error.message, 'Payment Failed');
      setLoading(false);
      setGeneratingReceipt(false);
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
          <h2 className="text-2xl font-bold text-gray-800">
            {isAdmin ? 'Record & Verify Payment' : 'Record Contribution Payment'}
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            {isAdmin 
              ? 'Record verified community collection (Instantly credited to Master Account)' 
              : 'Submit chanda payment for Admin verification (Generates provisional payslip)'}
          </p>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">
          {isAdmin ? (
            <span className="flex items-center gap-1 text-emerald-700">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Admin Mode (Auto-Verified)
            </span>
          ) : (
            <span className="flex items-center gap-1 text-amber-700">
              <Clock className="w-4 h-4 text-amber-600" />
              Member Mode (Pending Verification)
            </span>
          )}
        </div>
      </div>

      {/* Role Alert Banner */}
      {!isAdmin && (
        <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 flex items-start gap-2.5 mb-6">
          <UserCheck className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">Verification Process:</p>
            <p className="mt-0.5 leading-relaxed">
              When you submit this payment, an initial <strong>Provisional Contribution Slip</strong> will download for your records. The payment will show as <strong>Unpaid / Pending Verification</strong> until an Admin approves and marks it as paid in the Master Account.
            </p>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="w-full">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Contributing Family <span className="text-red-500 ml-1">*</span>
          </label>
          <select
            value={familyId}
            onChange={(e) => setFamilyId(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
            required
          >
            <option value="">Select a family</option>
            {families.map((family) => (
              <option key={family.id} value={family.id}>
                {family.headName} - {family.phone}
              </option>
            ))}
          </select>
        </div>

        <div className="w-full">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Festival / Event <span className="text-red-500 ml-1">*</span>
          </label>
          <select
            value={festivalId}
            onChange={(e) => handleFestivalChange(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
            required
          >
            <option value="">Select a festival</option>
            {festivals.map((festival) => (
              <option key={festival.id} value={festival.id}>
                {festival.name} - ₹{festival.amountPerFamily.toLocaleString('en-IN')}
              </option>
            ))}
          </select>
        </div>

        <Input
          label="Payment Amount (₹)"
          type="number"
          value={amount.toString()}
          onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
          min="1"
          required
        />

        <Input
          label="Payment Date"
          type="date"
          value={paidDate}
          onChange={(e) => setPaidDate(e.target.value)}
          required
        />

        <Textarea
          label="Notes / Transaction Ref"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="e.g., Paid via UPI (Txn ID: 12345678), Cash given to treasurer"
          rows={3}
        />

        <div className="flex gap-4 pt-2">
          <Button 
            type="submit" 
            isLoading={loading || generatingReceipt} 
            disabled={loading || generatingReceipt}
            className="flex items-center gap-1.5"
          >
            <Receipt className="w-4 h-4" />
            {generatingReceipt 
              ? (isAdmin ? 'Generating Receipt...' : 'Generating Payslip...') 
              : (isAdmin ? 'Record & Verify Payment' : 'Submit Payment & Download Slip')}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push(APP_ROUTES.PAYMENTS)}
            disabled={loading || generatingReceipt}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Card>
  );
};
