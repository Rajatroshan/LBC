'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Input, Card } from '@/core/ui';
import { familyContainer } from '../../di/family.container';
import { APP_ROUTES } from '@/core/routes';

export const FamilyForm: React.FC<{ familyId?: string }> = ({ familyId }) => {
  const [headName, setHeadName] = useState('');
  const [members, setMembers] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const createFamilyUseCase = familyContainer.createFamilyUseCase();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await createFamilyUseCase.execute({
        headName,
        members: parseInt(members),
        phone,
        address,
      });
      router.push(APP_ROUTES.FAMILIES);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error.message || 'Failed to create family');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        {familyId ? 'Edit Family' : 'Add New Family'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Head of Family Name"
          value={headName}
          onChange={(e) => setHeadName(e.target.value)}
          placeholder="Enter head of family name"
          required
        />

        <Input
          type="number"
          label="Number of Members"
          value={members}
          onChange={(e) => setMembers(e.target.value)}
          placeholder="Enter number of members"
          min="1"
          required
        />

        <Input
          label="Phone Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Enter phone number"
          required
        />

        <Input
          label="Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Enter address"
          required
        />

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <div className="flex gap-3">
          <Button type="submit" isLoading={loading}>
            {familyId ? 'Update' : 'Create'}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push(APP_ROUTES.FAMILIES)}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Card>
  );
};
