'use client';

import React, { useEffect, useState } from 'react';
import { Family } from '@/core/types';
import { familyContainer } from '../../di/family.container';
import { Card, Button, Loader } from '@/core/ui';
import Link from 'next/link';
import { APP_ROUTES } from '@/core/routes';
import { useAuth } from '@/features/auth/presentation/context/AuthContext';

export const FamilyList: React.FC = () => {
  const [families, setFamilies] = useState<Family[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { isAdmin } = useAuth();

  const getFamiliesUseCase = familyContainer.getFamiliesUseCase();

  useEffect(() => {
    loadFamilies();
  }, []);

  const loadFamilies = async () => {
    setLoading(true);
    try {
      const data = await getFamiliesUseCase.execute({ isActive: true });
      setFamilies(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load families');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <p className="text-red-600">{error}</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Families</h2>
        {isAdmin && (
          <Link href={APP_ROUTES.FAMILY_CREATE}>
            <Button>Add Family</Button>
          </Link>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {families.map((family) => (
          <Card key={family.id} className="hover:shadow-lg transition-shadow">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              {family.headName}
            </h3>
            <div className="space-y-1 text-sm text-gray-600">
              <p>Members: {family.members}</p>
              <p>Phone: {family.phone}</p>
              <p>Address: {family.address}</p>
            </div>
            {isAdmin && (
              <div className="mt-4 flex gap-2">
                <Link href={APP_ROUTES.FAMILY_EDIT(family.id)}>
                  <Button size="sm" variant="outline">
                    Edit
                  </Button>
                </Link>
              </div>
            )}
          </Card>
        ))}
      </div>

      {families.length === 0 && (
        <Card>
          <p className="text-center text-gray-600">No families found</p>
        </Card>
      )}
    </div>
  );
};
