'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { familyController } from '@/controllers/family.controller';
import { Family } from '@/models';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Loader } from '@/components/ui/Loader';
import { APP_ROUTES } from '@/core/routes';
import Link from 'next/link';

export default function FamilyDetailPage({ params }: { params: { id: string } }) {
  const [family, setFamily] = useState<Family | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const loadFamily = async () => {
      try {
        const family = await familyController.getFamilyById(params.id);
        if (family) {
          setFamily(family);
        } else {
          setError('Family not found');
        }
      } catch (err) {
        console.error('Failed to load family:', err);
        setError('Failed to load family details');
      } finally {
        setLoading(false);
      }
    };

    loadFamily();
  }, [params.id]);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this family? This action cannot be undone.')) {
      return;
    }

    setDeleting(true);
    try {
      await familyController.deleteFamily(params.id);
      router.push(APP_ROUTES.FAMILIES);
    } catch (err) {
      console.error('Failed to delete family:', err);
      alert('Failed to delete family. Please try again.');
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader />
      </div>
    );
  }

  if (error || !family) {
    return (
      <Card>
        <p className="text-red-600">{error || 'Family not found'}</p>
        <Link href={APP_ROUTES.FAMILIES}>
          <Button className="mt-4">Back to Families</Button>
        </Link>
      </Card>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-8">
      <Card>
        <div className="flex justify-between items-start mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Family Details</h1>
          <div className="flex gap-2">
            <Link href={APP_ROUTES.FAMILY_EDIT(params.id)}>
              <Button size="sm">Edit</Button>
            </Link>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting ? 'Deleting...' : 'Delete'}
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600">Head of Family</label>
            <p className="text-lg text-gray-800 mt-1">{family.headName}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600">Number of Members</label>
            <p className="text-lg text-gray-800 mt-1">{family.members}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600">Phone Number</label>
            <p className="text-lg text-gray-800 mt-1">{family.phone}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600">Address</label>
            <p className="text-lg text-gray-800 mt-1">{family.address}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600">Status</label>
            <p className="text-lg text-gray-800 mt-1">
              {family.isActive ? (
                <span className="text-green-600">Active</span>
              ) : (
                <span className="text-red-600">Inactive</span>
              )}
            </p>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t">
          <Link href={APP_ROUTES.FAMILIES}>
            <Button variant="outline">Back to Families</Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
