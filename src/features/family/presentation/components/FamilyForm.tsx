'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Input, Card, Loader } from '@/core/ui';
import { familyContainer } from '../../di/family.container';
import { APP_ROUTES } from '@/core/routes';

export const FamilyForm: React.FC<{ familyId?: string }> = ({ familyId }) => {
  const [headName, setHeadName] = useState('');
  const [members, setMembers] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(familyId ? true : false);
  const [submitting, setSubmitting] = useState(false);

  const router = useRouter();
  const createFamilyUseCase = familyContainer.createFamilyUseCase();
  const updateFamilyUseCase = familyContainer.updateFamilyUseCase();
  const getFamiliesUseCase = familyContainer.getFamiliesUseCase();

  // Load family data if editing
  useEffect(() => {
    if (familyId) {
      const loadFamily = async () => {
        try {
          const families = await getFamiliesUseCase.execute();
          const family = families.find((f) => f.id === familyId);
          if (family) {
            setHeadName(family.headName);
            setMembers(family.members.toString());
            setPhone(family.phone);
            setAddress(family.address);
          } else {
            setError('Family not found');
          }
        } catch (err) {
          const error = err instanceof Error ? err : new Error('Unknown error');
          setError(error.message || 'Failed to load family');
        } finally {
          setLoading(false);
        }
      };

      loadFamily();
    }
  }, [familyId, getFamiliesUseCase]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      if (familyId) {
        // Update existing family
        await updateFamilyUseCase.execute({
          id: familyId,
          data: {
            headName,
            members: parseInt(members),
            phone,
            address,
          },
        });
      } else {
        // Create new family
        await createFamilyUseCase.execute({
          headName,
          members: parseInt(members),
          phone,
          address,
        });
      }
      router.push(APP_ROUTES.FAMILIES);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error.message || `Failed to ${familyId ? 'update' : 'create'} family`);
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
        {familyId ? 'Edit Family' : 'Add New Family'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <Input
          label="Head of Family Name *"
          value={headName}
          onChange={(e) => setHeadName(e.target.value)}
          placeholder="Enter head of family name"
          required
        />

        <Input
          type="number"
          label="Number of Members *"
          value={members}
          onChange={(e) => setMembers(e.target.value)}
          placeholder="Enter number of members"
          min="1"
          required
        />

        <Input
          label="Phone Number *"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Enter phone number"
          required
        />

        <Input
          label="Address *"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Enter address"
          required
        />

        <div className="flex gap-3">
          <Button type="submit" disabled={submitting}>
            {submitting ? (familyId ? 'Updating...' : 'Creating...') : familyId ? 'Update' : 'Create'}
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
