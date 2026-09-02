'use client';

import { useCallback, useEffect, useState } from 'react';
import { Festival } from '@/models';
import { festivalController } from '@/controllers/festival.controller';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Loader } from '@/components/ui/Loader';
import { formatDate, formatCurrency } from '@/utils';
import { PaymentList } from '@/components/payments/PaymentList';
import { APP_ROUTES } from '@/core/routes';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import Link from 'next/link';
import { Calendar, Clock, Edit, Power, PowerOff } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default function FestivalDetailPage({ params }: { params: { id: string } }) {
  const [festival, setFestival] = useState<Festival | null>(null);
  const [loading, setLoading] = useState(true);
  const [togglingStatus, setTogglingStatus] = useState(false);
  const [error, setError] = useState('');
  const { isAdmin } = useAuth();
  const { toast } = useToast();

  const loadFestival = useCallback(async () => {
    setLoading(true);
    try {
      const selectedFestival = await festivalController.getFestivalById(params.id);
      if (!selectedFestival) {
        setError('Festival not found');
      } else {
        setFestival(selectedFestival);
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error.message || 'Failed to load festival');
    } finally {
      setLoading(false);
    }
  }, [params.id]);

  useEffect(() => {
    loadFestival();
  }, [loadFestival]);

  const handleToggleStatus = async () => {
    if (!festival) return;
    const newStatus = !festival.isActive;
    setTogglingStatus(true);
    try {
      await festivalController.toggleFestivalStatus(festival.id, newStatus);
      setFestival({
        ...festival,
        isActive: newStatus,
      });
      if (newStatus) {
        toast.success(`Festival "${festival.name}" is now Active.`, 'Festival Activated');
      } else {
        toast.info(`Festival "${festival.name}" has been marked Inactive.`, 'Festival Deactivated');
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to update festival status';
      toast.error(msg, 'Status Update Failed');
    } finally {
      setTogglingStatus(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader />
      </div>
    );
  }

  if (error || !festival) {
    return (
      <Card>
        <p className="text-red-600">{error || 'Festival not found'}</p>
        <Link href={APP_ROUTES.FESTIVALS}>
          <Button className="mt-4">Back to Festivals</Button>
        </Link>
      </Card>
    );
  }

  const isMultiDay = Boolean(festival.endDate && festival.isMultiDay);
  const diffDays = isMultiDay && festival.endDate
    ? Math.ceil((new Date(festival.endDate).getTime() - new Date(festival.date).getTime()) / (1000 * 60 * 60 * 24)) + 1
    : 1;

  const isPast = festivalController.isDatePassed(festival.date, festival.endDate);

  return (
    <div className="space-y-6">
      <Card>
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold text-gray-800">{festival.name}</h1>
              <span
                className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                  festival.isActive
                    ? 'bg-green-100 text-green-800'
                    : isPast
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {festival.isActive ? 'Active' : isPast ? 'Inactive (Date Passed)' : 'Inactive (Manually Paused)'}
              </span>
            </div>

            <div className="space-y-2 text-gray-600 mt-4">
              <div className="flex items-center gap-2 text-sm">
                {isMultiDay ? (
                  <Clock className="w-4 h-4 text-primary-600" />
                ) : (
                  <Calendar className="w-4 h-4 text-primary-600" />
                )}
                <strong>Schedule:</strong>
                {isMultiDay && festival.endDate ? (
                  <span>
                    {formatDate(festival.date)} – {formatDate(festival.endDate)}{' '}
                    <span className="text-xs bg-primary-50 text-primary-700 px-2 py-0.5 rounded font-medium ml-1">
                      {diffDays} days duration
                    </span>
                  </span>
                ) : (
                  <span>{formatDate(festival.date)} (Single Day)</span>
                )}
              </div>

              <p className="text-sm">
                <strong>Contribution Per Family:</strong>{' '}
                <span className="text-primary-700 font-bold">{formatCurrency(festival.amountPerFamily)}</span>
              </p>

              {festival.description && (
                <p className="text-sm pt-1 text-gray-700">
                  <strong>Description:</strong> {festival.description}
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Admin Manual Toggle Status Button */}
            {isAdmin && (
              <Button
                size="sm"
                variant={festival.isActive ? 'outline' : 'primary'}
                onClick={handleToggleStatus}
                isLoading={togglingStatus}
                disabled={togglingStatus}
                className={`flex items-center gap-1.5 ${
                  festival.isActive 
                    ? 'text-red-700 border-red-300 hover:bg-red-50' 
                    : 'bg-green-600 hover:bg-green-700 text-white'
                }`}
              >
                {festival.isActive ? (
                  <>
                    <PowerOff className="w-3.5 h-3.5" />
                    Deactivate Festival
                  </>
                ) : (
                  <>
                    <Power className="w-3.5 h-3.5" />
                    Activate Festival
                  </>
                )}
              </Button>
            )}

            {isAdmin && (
              <Link href={APP_ROUTES.FESTIVAL_EDIT(festival.id)}>
                <Button size="sm" variant="outline" className="flex items-center gap-1.5">
                  <Edit className="w-3.5 h-3.5" />
                  Edit Festival
                </Button>
              </Link>
            )}
          </div>
        </div>
      </Card>

      <PaymentList festivalId={festival.id} />
    </div>
  );
}
