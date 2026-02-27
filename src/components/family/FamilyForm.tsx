'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { familyController } from '@/controllers/family.controller';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Loader } from '@/components/ui/Loader';
import { APP_ROUTES } from '@/core/routes';

interface FamilyFormProps {
  familyId?: string;
}

export const FamilyForm: React.FC<FamilyFormProps> = ({ familyId }) => {
  const [headName, setHeadName] = useState('');
  const [members, setMembers] = useState(1);
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(!!familyId);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (familyId) {
      const loadFamily = async () => {
        try {
          const family = await familyController.getFamilyById(familyId);
          setHeadName(family.headName);
          setMembers(family.members);
          setPhone(family.phone);
          setAddress(family.address);
        } catch {
          setError('Failed to load family');
        } finally {
          setLoadingData(false);
        }
      };
      loadFamily();
    }
  }, [familyId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (familyId) {
        await familyController.updateFamily(familyId, { headName, members, phone, address });
      } else {
        await familyController.createFamily({ headName, members, phone, address });
      }
      router.push(APP_ROUTES.FAMILIES);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Operation failed';
      setError(errorMessage);
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
        {familyId ? 'Edit Family' : 'Add New Family'}
      </h2>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label="Head of Family"
          value={headName}
          onChange={(e) => setHeadName(e.target.value)}
          placeholder="Enter head of family name"
          required
        />

        <Input
          label="Number of Members"
          type="number"
          value={members.toString()}
          onChange={(e) => setMembers(parseInt(e.target.value) || 1)}
          min="1"
          required
        />

        <Input
          label="Phone Number"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Enter phone number"
          required
        />

        <Textarea
          label="Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Enter address"
          rows={3}
        />

        <div className="flex gap-4">
          <Button type="submit" isLoading={loading} disabled={loading}>
            {familyId ? 'Update Family' : 'Create Family'}
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
