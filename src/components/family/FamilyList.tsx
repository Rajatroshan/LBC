'use client';

import React, { useEffect, useState } from 'react';
import { familyController } from '@/controllers/family.controller';
import { Family } from '@/models';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Loader } from '@/components/ui/Loader';
import Link from 'next/link';
import { APP_ROUTES } from '@/core/routes';

export const FamilyList: React.FC = () => {
  const [families, setFamilies] = useState<Family[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');

  const loadFamilies = async (searchTerm?: string) => {
    setLoading(true);
    setError('');
    try {
      const data = await familyController.getAllFamilies(
        searchTerm ? { search: searchTerm } : undefined
      );
      setFamilies(data);
    } catch (err) {
      console.error('Failed to load families:', err);
      setError('Failed to load families');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFamilies();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    loadFamilies(search);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Families</h1>
        <Link href={APP_ROUTES.FAMILY_CREATE}>
          <Button>Add Family</Button>
        </Link>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <Input
          placeholder="Search by name or phone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1"
        />
        <Button type="submit" variant="outline">Search</Button>
      </form>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader />
        </div>
      ) : error ? (
        <Card>
          <p className="text-red-600">{error}</p>
        </Card>
      ) : families.length === 0 ? (
        <Card>
          <p className="text-center text-gray-500 py-8">No families found</p>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {families.map((family) => (
            <Link key={family.id} href={APP_ROUTES.FAMILY_DETAIL(family.id)}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">{family.headName}</h3>
                    <p className="text-sm text-gray-500">{family.phone}</p>
                    <p className="text-sm text-gray-500">{family.members} members</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    family.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {family.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};
