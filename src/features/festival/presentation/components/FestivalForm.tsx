'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Input, Card, Textarea, Loader } from '@/core/ui';
import { festivalContainer } from '../../di/festival.container';
import { APP_ROUTES } from '@/core/routes';

export const FestivalForm: React.FC<{ festivalId?: string }> = ({ festivalId }) => {
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [amountPerFamily, setAmountPerFamily] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(festivalId ? true : false);
  const [submitting, setSubmitting] = useState(false);

  const router = useRouter();
  const createFestivalUseCase = festivalContainer.createFestivalUseCase();
  const updateFestivalUseCase = festivalContainer.updateFestivalUseCase();
  const getFestivalsUseCase = festivalContainer.getFestivalsUseCase();

  // Load festival data if editing
  useEffect(() => {
    if (festivalId) {
      const loadFestival = async () => {
        try {
          const festivals = await getFestivalsUseCase.execute();
          const festival = festivals.find((f) => f.id === festivalId);
          if (festival) {
            setName(festival.name);
            setType(festival.type);
            setDescription(festival.description || '');
            setDate(festival.date.toISOString().split('T')[0]);
            setAmountPerFamily(festival.amountPerFamily.toString());
          } else {
            setError('Festival not found');
          }
        } catch (err) {
          const error = err instanceof Error ? err : new Error('Unknown error');
          setError(error.message || 'Failed to load festival');
        } finally {
          setLoading(false);
        }
      };

      loadFestival();
    }
  }, [festivalId, getFestivalsUseCase]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name || !type || !date || !amountPerFamily) {
      setError('Please fill in all required fields');
      return;
    }

    setSubmitting(true);

    try {
      if (festivalId) {
        // Update existing festival
        await updateFestivalUseCase.execute({
          id: festivalId,
          data: {
            name,
            type,
            date: new Date(date),
            amountPerFamily: parseFloat(amountPerFamily),
            description: description || undefined,
          },
        });
      } else {
        // Create new festival
        await createFestivalUseCase.execute({
          name,
          type,
          date: new Date(date),
          amountPerFamily: parseFloat(amountPerFamily),
          description: description || undefined,
        });
      }

      router.push(APP_ROUTES.FESTIVALS);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error.message || `Failed to ${festivalId ? 'update' : 'create'} festival`);
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
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        {festivalId ? 'Edit Festival' : 'Add New Festival'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <Input
          label="Festival Name *"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g., Diwali, Holi, New Year"
          required
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Festival Type *
          </label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            required
          >
            <option value="">-- Select Type --</option>
            <option value="Religious">Religious</option>
            <option value="Cultural">Cultural</option>
            <option value="Social">Social</option>
            <option value="Community">Community</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <Input
          label="Festival Date *"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />

        <Input
          label="Amount Per Family (₹) *"
          type="number"
          step="0.01"
          min="0"
          value={amountPerFamily}
          onChange={(e) => setAmountPerFamily(e.target.value)}
          placeholder="Enter amount"
          required
        />

        <Textarea
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Festival details (optional)"
          rows={4}
        />

        <div className="flex gap-3 mt-6">
          <Button type="submit" disabled={submitting}>
            {submitting ? (festivalId ? 'Updating...' : 'Creating...') : festivalId ? 'Update' : 'Create'}
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
