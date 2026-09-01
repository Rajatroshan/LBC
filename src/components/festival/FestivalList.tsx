'use client';

import React, { useEffect, useState } from 'react';
import { festivalController } from '@/controllers/festival.controller';
import { Festival } from '@/models';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Loader } from '@/components/ui/Loader';
import { formatDate, formatCurrency } from '@/utils';
import Link from 'next/link';
import { APP_ROUTES } from '@/core/routes';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { Calendar, Clock, Plus, Power, PowerOff } from 'lucide-react';

export const FestivalList: React.FC = () => {
  const [festivals, setFestivals] = useState<Festival[]>([]);
  const [loading, setLoading] = useState(true);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const { isAdmin } = useAuth();
  const { toast } = useToast();

  const loadFestivals = async () => {
    try {
      const data = await festivalController.getAllFestivals();
      setFestivals(data);
    } catch (err) {
      console.error('Failed to load festivals:', err);
      setError('Failed to load festivals');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFestivals();
  }, []);

  const handleToggleStatus = async (e: React.MouseEvent, festival: Festival) => {
    e.preventDefault();
    e.stopPropagation();
    
    const newStatus = !festival.isActive;
    setTogglingId(festival.id);
    try {
      await festivalController.toggleFestivalStatus(festival.id, newStatus);
      setFestivals(prev =>
        prev.map(f => (f.id === festival.id ? { ...f, isActive: newStatus } : f))
      );
      if (newStatus) {
        toast.success(`Festival "${festival.name}" activated successfully!`, 'Festival Activated');
      } else {
        toast.info(`Festival "${festival.name}" deactivated.`, 'Festival Deactivated');
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to update festival status';
      toast.error(msg, 'Status Update Failed');
    } finally {
      setTogglingId(null);
    }
  };

  const formatFestivalDates = (festival: Festival) => {
    const startStr = formatDate(festival.date);
    if (festival.endDate && festival.isMultiDay) {
      const endStr = formatDate(festival.endDate);
      const diffTime = new Date(festival.endDate).getTime() - new Date(festival.date).getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      return `${startStr} – ${endStr} (${diffDays} days)`;
    }
    return startStr;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Festivals</h1>
          <p className="text-sm text-gray-500 mt-1">Manage community pujas, festivals, and subscriptions</p>
        </div>
        <Link href={APP_ROUTES.FESTIVAL_CREATE}>
          <Button className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Festival
          </Button>
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader />
        </div>
      ) : error ? (
        <Card>
          <p className="text-red-600">{error}</p>
        </Card>
      ) : festivals.length === 0 ? (
        <Card>
          <p className="text-center text-gray-500 py-8">No festivals found. Click &quot;Add Festival&quot; to create one.</p>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {festivals.map((festival) => {
            const isPast = festivalController.isDatePassed(festival.date, festival.endDate);

            return (
              <div key={festival.id} className="relative group">
                <Link href={APP_ROUTES.FESTIVAL_DETAIL(festival.id)} className="block h-full">
                  <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer h-full flex flex-col justify-between border-gray-200 hover:border-primary-300">
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-bold text-gray-800 leading-snug">{festival.name}</h3>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold shrink-0 ml-2 ${
                          festival.isActive 
                            ? 'bg-green-100 text-green-700' 
                            : isPast 
                            ? 'bg-amber-100 text-amber-800' 
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          {festival.isActive ? 'Active' : isPast ? 'Inactive (Passed)' : 'Inactive'}
                        </span>
                      </div>

                      <div className="space-y-1.5 text-sm text-gray-600 mt-3">
                        <div className="flex items-center gap-1.5 text-gray-700">
                          {festival.endDate && festival.isMultiDay ? (
                            <Clock className="w-4 h-4 text-primary-600 shrink-0" />
                          ) : (
                            <Calendar className="w-4 h-4 text-primary-600 shrink-0" />
                          )}
                          <span className="font-medium text-xs sm:text-sm">
                            {formatFestivalDates(festival)}
                          </span>
                        </div>

                        <p className="pt-1">
                          <span className="text-gray-500 text-xs">Amount:</span>{' '}
                          <span className="font-bold text-primary-700 text-base">{formatCurrency(festival.amountPerFamily)}</span>
                          <span className="text-xs text-gray-500 font-normal"> / family</span>
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                      {festival.description ? (
                        <p className="text-xs text-gray-500 line-clamp-1 flex-1 pr-2">
                          {festival.description}
                        </p>
                      ) : (
                        <span className="text-xs text-gray-400">View details</span>
                      )}

                      {/* Admin Toggle Quick Button */}
                      {isAdmin && (
                        <button
                          type="button"
                          onClick={(e) => handleToggleStatus(e, festival)}
                          disabled={togglingId === festival.id}
                          title={festival.isActive ? 'Click to Deactivate' : 'Click to Activate'}
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                            festival.isActive
                              ? 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-200'
                              : 'bg-green-50 text-green-700 hover:bg-green-100 border border-green-200'
                          }`}
                        >
                          {festival.isActive ? (
                            <>
                              <PowerOff className="w-3 h-3" />
                              Deactivate
                            </>
                          ) : (
                            <>
                              <Power className="w-3 h-3" />
                              Activate
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </Card>
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
