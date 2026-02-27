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
import { APP_ROUTES } from '@/core/routes';

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
  const { user } = useAuth();

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
      } finally {
        setLoadingData(false);
      }
    };

    loadData();
  }, []);

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
      // Create payment first
      const payment = await paymentController.createPayment({
        familyId,
        festivalId,
        amount,
        paidDate: new Date(paidDate),
        status: 'PAID',
        notes: notes || undefined,
        generateReceipt: false, // We'll generate it separately to show UI feedback
        generatedBy: user?.id,
      });

      setLoading(false);

      // Generate receipt with UI feedback
      if (user?.id) {
        setGeneratingReceipt(true);
        try {
          console.log('Starting receipt generation for payment:', payment.id);
          const { receipt, pdfBlob } = await paymentController.generateReceiptWithoutStorage(
            payment.id,
            user.id
          );
          console.log('Receipt generated successfully:', receipt);
          
          // Download PDF immediately
          const url = URL.createObjectURL(pdfBlob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `${receipt.receiptNumber}.pdf`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
          
          // Show success message and redirect
          alert(`Payment recorded successfully!\nReceipt ${receipt.receiptNumber} has been downloaded.`);
          router.push(APP_ROUTES.PAYMENTS);
        } catch (receiptError) {
          console.error('Failed to generate receipt:', receiptError);
          setGeneratingReceipt(false);
          // Payment is still successful, just show warning
          const errorMessage = receiptError instanceof Error 
            ? receiptError.message 
            : 'Unknown error occurred';
          alert(`Payment recorded but receipt generation failed: ${errorMessage}\n\nYou can generate it later from the payments list.`);
          router.push(APP_ROUTES.PAYMENTS);
        } finally {
          setGeneratingReceipt(false);
        }
      } else {
        // No user, just redirect
        alert('Payment recorded successfully! (No user logged in for receipt generation)');
        router.push(APP_ROUTES.PAYMENTS);
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to record payment');
      console.error('Payment error:', error);
      setError(error.message);
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
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Record Payment</h2>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="w-full">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Family <span className="text-red-500 ml-1">*</span>
          </label>
          <select
            value={familyId}
            onChange={(e) => setFamilyId(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            required
          >
            <option value="">Select Family</option>
            {families.map((f) => (
              <option key={f.id} value={f.id}>{f.headName}</option>
            ))}
          </select>
        </div>

        <div className="w-full">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Festival <span className="text-red-500 ml-1">*</span>
          </label>
          <select
            value={festivalId}
            onChange={(e) => handleFestivalChange(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            required
          >
            <option value="">Select Festival</option>
            {festivals.map((f) => (
              <option key={f.id} value={f.id}>{f.name}</option>
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
          label="Payment Date"
          type="date"
          value={paidDate}
          onChange={(e) => setPaidDate(e.target.value)}
          required
        />

        <Textarea
          label="Notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Any additional notes (optional)"
          rows={3}
        />

        <div className="flex gap-4">
          <Button 
            type="submit" 
            isLoading={loading || generatingReceipt} 
            disabled={loading || generatingReceipt}
          >
            {generatingReceipt ? 'Generating Receipt...' : 'Record Payment'}
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
