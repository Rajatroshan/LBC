'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { festivalController } from '@/controllers/festival.controller';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Loader } from '@/components/ui/Loader';
import { APP_ROUTES } from '@/core/routes';
import { FestivalType } from '@/constants';

interface FestivalFormProps {
  festivalId?: string;
}

export const FestivalForm: React.FC<FestivalFormProps> = ({ festivalId }) => {
  const [name, setName] = useState('');
  const [type, setType] = useState<string>(FestivalType.OTHER);
  const [date, setDate] = useState('');
  const [amountPerFamily, setAmountPerFamily] = useState(0);
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(!!festivalId);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (festivalId) {
      const loadFestival = async () => {
        try {
          const festival = await festivalController.getFestivalById(festivalId);
          setName(festival.name);
          setType(festival.type);
          setDate(festival.date.toISOString().split('T')[0]);
          setAmountPerFamily(festival.amountPerFamily);
          setDescription(festival.description || '');
        } catch {
          setError('Failed to load festival');
        } finally {
          setLoadingData(false);
        }
      };
      loadFestival();
    }
  }, [festivalId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const festivalData = {
        name,
        type,
        date: new Date(date),
        amountPerFamily,
        description: description || undefined,
      };

      if (festivalId) {
        await festivalController.updateFestival(festivalId, festivalData);
      } else {
        await festivalController.createFestival(festivalData);
      }
      router.push(APP_ROUTES.FESTIVALS);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Operation failed');
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
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        {festivalId ? 'Edit Festival' : 'Add New Festival'}
      </h2>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label="Festival Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter festival name"
          required
        />

        <div className="w-full">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Type <span className="text-red-500 ml-1">*</span>
          </label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            required
          >
            {Object.values(FestivalType).map((t) => (
              <option key={t} value={t}>{t.replace(/_/g, ' ')}</option>
            ))}
          </select>
        </div>

        <Input
          label="Date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />

        <Input
          label="Amount Per Family (₹)"
          type="number"
          value={amountPerFamily.toString()}
          onChange={(e) => setAmountPerFamily(parseFloat(e.target.value) || 0)}
          min="0"
          required
        />

        <Textarea
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter description (optional)"
          rows={3}
        />

        <div className="flex gap-4">
          <Button type="submit" isLoading={loading} disabled={loading}>
            {festivalId ? 'Update Festival' : 'Create Festival'}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push(APP_ROUTES.FESTIVALS)}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Card>
  );
};
