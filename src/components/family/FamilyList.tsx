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
import { PlusCircle, Search, Users, Phone } from 'lucide-react';

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
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-white p-5 rounded-3xl border-2 border-amber-200 shadow-sm">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-stone-900 flex items-center gap-2">
            <span>🏡</span>
            <span>Gram Parivar Directory</span>
          </h1>
          <p className="text-xs text-stone-500 font-medium mt-0.5">
            Registered village households, family heads, and member counts
          </p>
        </div>
        <Link href={APP_ROUTES.FAMILY_CREATE}>
          <Button className="flex items-center gap-1.5 text-xs font-black rounded-2xl bg-orange-600 hover:bg-orange-700 text-white shadow-sm border border-amber-200">
            <PlusCircle className="w-3.5 h-3.5" />
            + Add New Family
          </Button>
        </Link>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <Input
          placeholder="Search parivar by head name or phone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 rounded-2xl border-2 border-amber-200 bg-white"
        />
        <Button type="submit" variant="outline" className="rounded-2xl border-2 border-amber-300 bg-white font-bold flex items-center gap-1.5 text-xs">
          <Search className="w-3.5 h-3.5 text-orange-600" />
          <span>Search</span>
        </Button>
      </form>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader />
        </div>
      ) : error ? (
        <Card>
          <p className="text-red-600 font-bold">{error}</p>
        </Card>
      ) : families.length === 0 ? (
        <Card>
          <p className="text-center text-stone-500 py-10 font-bold">No village families found matching your search.</p>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {families.map((family) => (
            <Link key={family.id} href={APP_ROUTES.FAMILY_DETAIL(family.id)}>
              <div className="bg-white rounded-3xl p-5 border-2 border-amber-200/80 hover:border-amber-400 hover:shadow-lg transition-all cursor-pointer group space-y-3">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-100 to-orange-100 text-orange-900 font-black flex items-center justify-center text-sm border-2 border-amber-300 group-hover:scale-105 transition-transform">
                      👨🌾
                    </div>
                    <div>
                      <h3 className="text-base font-black text-stone-900 group-hover:text-orange-700 transition-colors">
                        {family.headName}
                      </h3>
                      <p className="text-xs text-stone-500 font-medium flex items-center gap-1 mt-0.5">
                        <Phone className="w-3 h-3 text-amber-700" />
                        <span>{family.phone}</span>
                      </p>
                    </div>
                  </div>

                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black border ${
                    family.isActive 
                      ? 'bg-emerald-100 text-emerald-800 border-emerald-300' 
                      : 'bg-red-100 text-red-800 border-red-300'
                  }`}>
                    {family.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs font-bold pt-2 border-t border-amber-100 text-stone-600">
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-amber-700" />
                    <span>{family.members} Sadasya (Members)</span>
                  </span>
                  <span className="text-orange-700 font-black text-[11px] group-hover:underline">
                    View Ledger →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};
