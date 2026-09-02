'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { festivalController } from '@/controllers/festival.controller';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Loader } from '@/components/ui/Loader';
import { APP_ROUTES } from '@/core/routes';
import { PREDEFINED_FESTIVALS } from '@/constants';
import { useToast } from '@/contexts/ToastContext';
import { useAuth } from '@/contexts/AuthContext';
import { Calendar, Clock, Sparkles } from 'lucide-react';

interface FestivalFormProps {
  festivalId?: string;
}

export const FestivalForm: React.FC<FestivalFormProps> = ({ festivalId }) => {
  // Title dropdown state
  const [selectedFestivalDropdown, setSelectedFestivalDropdown] = useState<string>('Durga Puja');
  const [customName, setCustomName] = useState('');

  // Event duration type state
  const [dateType, setDateType] = useState<'SINGLE_DAY' | 'DURATION'>('SINGLE_DAY');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);

  // Active status state
  const [isActive, setIsActive] = useState<boolean>(true);
  const [amountPerFamily, setAmountPerFamily] = useState(0);
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(!!festivalId);
  const [error, setError] = useState('');
  const { user } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    if (festivalId) {
      const loadFestival = async () => {
        try {
          const festival = await festivalController.getFestivalById(festivalId);
          
          // Match dropdown or set to custom 'OTHER'
          const isPredefined = (PREDEFINED_FESTIVALS as readonly string[]).includes(festival.name);
          if (isPredefined && festival.name !== 'OTHER') {
            setSelectedFestivalDropdown(festival.name);
            setCustomName('');
          } else {
            setSelectedFestivalDropdown('OTHER');
            setCustomName(festival.name);
          }

          const sDate = festival.date.toISOString().split('T')[0];
          setStartDate(sDate);

          if (festival.endDate || festival.isMultiDay) {
            setDateType('DURATION');
            const eDate = festival.endDate 
              ? festival.endDate.toISOString().split('T')[0] 
              : sDate;
            setEndDate(eDate);
          } else {
            setDateType('SINGLE_DAY');
            setEndDate(sDate);
          }

          setIsActive(festival.isActive ?? true);
          setAmountPerFamily(festival.amountPerFamily);
          setDescription(festival.description || '');
        } catch {
          setError('Failed to load festival');
          toast.error('Failed to load festival details', 'Loading Error');
        } finally {
          setLoadingData(false);
        }
      };
      loadFestival();
    }
  }, [festivalId, toast]);

  const handleFestivalDropdownChange = (val: string) => {
    setSelectedFestivalDropdown(val);
  };

  // Calculate duration in days for preview
  const calculateDuration = () => {
    if (dateType === 'SINGLE_DAY' || !startDate || !endDate) return 1;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = end.getTime() - start.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays > 0 ? diffDays : 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Resolve final festival name
    const finalName = selectedFestivalDropdown === 'OTHER' 
      ? customName.trim() 
      : selectedFestivalDropdown;

    if (!finalName) {
      const msg = 'Please specify a festival title.';
      setError(msg);
      toast.warning(msg, 'Validation Error');
      return;
    }

    // Validate dates
    if (dateType === 'DURATION') {
      const start = new Date(startDate);
      const end = new Date(endDate);
      if (end < start) {
        const msg = 'End Date cannot be before Start Date.';
        setError(msg);
        toast.warning(msg, 'Date Validation Error');
        return;
      }
    }

    setLoading(true);

    try {
      const festivalData = {
        name: finalName,
        date: new Date(startDate),
        endDate: dateType === 'DURATION' ? new Date(endDate) : undefined,
        isMultiDay: dateType === 'DURATION',
        amountPerFamily,
        description: description || undefined,
        isActive,
      };

      if (festivalId) {
        await festivalController.updateFestival(festivalId, {
          ...festivalData,
          updatedByUserId: user?.id,
          updatedByUserName: user?.name || user?.email,
        });
        toast.success(`Festival "${finalName}" updated successfully!`, 'Festival Updated');
      } else {
        await festivalController.createFestival({
          ...festivalData,
          createdByUserId: user?.id,
          createdByUserName: user?.name || user?.email,
          createdByUserEmail: user?.email,
        });
        toast.success(`Festival "${finalName}" created successfully!`, 'Festival Created');
      }
      router.push(APP_ROUTES.FESTIVALS);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Operation failed';
      setError(errorMessage);
      toast.error(errorMessage, 'Failed to Save');
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

  const durationDays = calculateDuration();

  return (
    <Card>
      <div className="flex items-center gap-2 mb-6">
        <Sparkles className="w-6 h-6 text-primary-600" />
        <h2 className="text-2xl font-bold text-gray-800">
          {festivalId ? 'Edit Festival' : 'Add New Festival'}
        </h2>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Festival Title Selection */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">
            Festival Title <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <select
              value={selectedFestivalDropdown}
              onChange={(e) => handleFestivalDropdownChange(e.target.value)}
              className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all text-sm font-medium shadow-sm"
              required
            >
              {PREDEFINED_FESTIVALS.map((fest) => (
                <option key={fest} value={fest}>
                  {fest === 'OTHER' ? '✨ Other (Custom Festival Name)' : fest}
                </option>
              ))}
            </select>
          </div>

          {/* Conditional Custom Name Field if 'OTHER' is selected */}
          {selectedFestivalDropdown === 'OTHER' && (
            <div className="pt-1 animate-in fade-in slide-in-from-top-2 duration-200">
              <Input
                label="Custom Festival Title"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                placeholder="Enter festival name (e.g., Jagannath Rath Yatra, Annual Feast)"
                required
                autoFocus
              />
            </div>
          )}
        </div>

        {/* Event Schedule: Single Day vs Duration */}
        <div className="space-y-3 p-4 bg-gray-50 border border-gray-200 rounded-xl">
          <label className="block text-sm font-semibold text-gray-800">
            Festival Schedule Type <span className="text-red-500">*</span>
          </label>

          {/* Radio / Segmented Selector */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label
              className={`flex items-center gap-3 p-3.5 rounded-lg border cursor-pointer transition-all ${
                dateType === 'SINGLE_DAY'
                  ? 'border-primary-500 bg-primary-50/70 text-primary-900 shadow-xs'
                  : 'border-gray-200 bg-white hover:bg-gray-100 text-gray-700'
              }`}
            >
              <input
                type="radio"
                name="scheduleType"
                value="SINGLE_DAY"
                checked={dateType === 'SINGLE_DAY'}
                onChange={() => setDateType('SINGLE_DAY')}
                className="w-4 h-4 text-primary-600 focus:ring-primary-500"
              />
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-primary-600" />
                <div>
                  <div className="text-sm font-semibold">Single Day Event</div>
                  <div className="text-xs text-gray-500">Event is conducted on one specific date</div>
                </div>
              </div>
            </label>

            <label
              className={`flex items-center gap-3 p-3.5 rounded-lg border cursor-pointer transition-all ${
                dateType === 'DURATION'
                  ? 'border-primary-500 bg-primary-50/70 text-primary-900 shadow-xs'
                  : 'border-gray-200 bg-white hover:bg-gray-100 text-gray-700'
              }`}
            >
              <input
                type="radio"
                name="scheduleType"
                value="DURATION"
                checked={dateType === 'DURATION'}
                onChange={() => setDateType('DURATION')}
                className="w-4 h-4 text-primary-600 focus:ring-primary-500"
              />
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary-600" />
                <div>
                  <div className="text-sm font-semibold">Duration / Multi-Day Event</div>
                  <div className="text-xs text-gray-500">Event spans across start and end dates</div>
                </div>
              </div>
            </label>
          </div>

          {/* Date Picker Fields */}
          <div className="pt-2">
            {dateType === 'SINGLE_DAY' ? (
              <Input
                label="Event Date"
                type="date"
                value={startDate}
                onChange={(e) => {
                  setStartDate(e.target.value);
                  setEndDate(e.target.value);
                }}
                required
              />
            ) : (
              <div className="space-y-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Start Date"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    required
                  />
                  <Input
                    label="End Date"
                    type="date"
                    value={endDate}
                    min={startDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    required
                  />
                </div>

                {startDate && endDate && (
                  <div className="text-xs text-primary-700 bg-primary-50 px-3 py-1.5 rounded-md flex items-center gap-2 font-medium">
                    <Clock className="w-3.5 h-3.5" />
                    <span>
                      Total Duration: {durationDays} {durationDays === 1 ? 'day' : 'days'} ({new Date(startDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })} – {new Date(endDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })})
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Expected Contribution Amount */}
        <Input
          label="Expected Contribution Per Family (₹)"
          type="number"
          value={amountPerFamily.toString()}
          onChange={(e) => setAmountPerFamily(parseFloat(e.target.value) || 0)}
          min="0"
          required
        />

        {/* Description */}
        <Textarea
          label="Description / Special Notes"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter description, rituals, or organizing committee notes (optional)"
          rows={3}
        />

        {/* Festival Active Status Toggle */}
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-semibold text-gray-800">
                Festival Active Status
              </label>
              <p className="text-xs text-gray-500 mt-0.5">
                Festivals automatically become inactive once their date has passed. You can also manually toggle status at any time.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsActive(!isActive)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
                isActive ? 'bg-green-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                  isActive ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
          <div className="pt-1">
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold ${
              isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-green-500' : 'bg-red-500'}`}></span>
              {isActive ? 'Active (Open for payments & collections)' : 'Inactive (Closed / Paused)'}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 pt-2">
          <Button type="submit" isLoading={loading} disabled={loading}>
            {festivalId ? 'Update Festival' : 'Create Festival'}
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
