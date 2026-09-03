'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { familyController } from '@/controllers/family.controller';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Loader } from '@/components/ui/Loader';
import { APP_ROUTES } from '@/core/routes';
import { sanitizePhone, isValidPhone } from '@/utils/validation';
import { useToast } from '@/contexts/ToastContext';
import { useAuth } from '@/contexts/AuthContext';
import { MarigoldToran } from '@/app/(landing)/components/VillageIllustrations';
import { Phone, Users, Home, UserCheck, AlertCircle } from 'lucide-react';

interface FamilyFormProps {
  familyId?: string;
}

export const FamilyForm: React.FC<FamilyFormProps> = ({ familyId }) => {
  const [headName, setHeadName] = useState('');
  const [members, setMembers] = useState(1);
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [isCheckingPhone, setIsCheckingPhone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(!!familyId);
  const [error, setError] = useState('');
  const { user } = useAuth();
  const { toast } = useToast();
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
          toast.error('Failed to load family details', 'Loading Error');
        } finally {
          setLoadingData(false);
        }
      };
      loadFamily();
    }
  }, [familyId, toast]);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numericValue = sanitizePhone(e.target.value);
    setPhone(numericValue);
    setPhoneError('');
  };

  const handlePhoneBlur = async () => {
    const cleanPhone = sanitizePhone(phone);
    if (!cleanPhone || cleanPhone.length < 10) return;

    setIsCheckingPhone(true);
    try {
      const { isAvailable, existingFamily } = await familyController.checkPhoneAvailability(
        cleanPhone,
        familyId
      );
      if (!isAvailable && existingFamily) {
        const msg = `Mobile number already registered for ${existingFamily.headName}'s family`;
        setPhoneError(msg);
      } else {
        setPhoneError('');
      }
    } catch {
      // Non-blocking on blur check
    } finally {
      setIsCheckingPhone(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setPhoneError('');

    const cleanPhone = sanitizePhone(phone);
    if (!isValidPhone(cleanPhone)) {
      const validationMsg = 'Mobile number must be 10-15 digits (numbers only)';
      setError(validationMsg);
      toast.warning(validationMsg, 'Validation Error');
      return;
    }

    setLoading(true);

    try {
      if (familyId) {
        await familyController.updateFamily(familyId, { 
          headName: headName.trim(), 
          members, 
          phone: cleanPhone, 
          address: address.trim(),
          updatedByUserId: user?.id,
          updatedByUserName: user?.name || user?.email,
        });
        toast.success(`Family "${headName}" updated successfully!`, 'Parivar Updated');
      } else {
        await familyController.createFamily({ 
          headName: headName.trim(), 
          members, 
          phone: cleanPhone, 
          address: address.trim(),
          createdByUserId: user?.id,
          createdByUserName: user?.name || user?.email,
          createdByUserEmail: user?.email,
        });
        toast.success(`Family "${headName}" added to Gram Directory!`, 'Parivar Registered');
      }
      router.push(APP_ROUTES.FAMILIES);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Operation failed';
      setError(errorMessage);
      if (errorMessage.includes('Mobile number must be unique')) {
        setPhoneError(errorMessage);
      }
      toast.error(errorMessage, 'Failed to Save');
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <div className="flex justify-center py-16 bg-[#FFFDF7] rounded-3xl border-2 border-amber-200">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <div className="w-full max-w-xl mx-auto">
      <div className="bg-[#FFFDF7] rounded-3xl shadow-xl p-6 sm:p-8 border-2 border-amber-300 relative overflow-hidden space-y-6">
        
        {/* Festive Marigold Toran Garland */}
        <div className="mb-1">
          <MarigoldToran className="opacity-85" />
        </div>

        {/* Form Title & Subtitle */}
        <div className="flex items-center gap-3.5 pb-2 border-b-2 border-amber-200/80">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-600 text-white flex items-center justify-center text-2xl shadow-sm border border-amber-200 shrink-0">
            🏡
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-stone-900">
              {familyId ? 'Edit Gram Parivar' : 'Register New Gram Parivar'}
            </h1>
            <p className="text-xs text-stone-600 font-semibold mt-0.5">
              Household head details, contact info &amp; village member count
            </p>
          </div>
        </div>

        {error && (
          <div className="bg-rose-50 border-2 border-rose-200 text-rose-900 px-4 py-3 rounded-2xl text-xs font-bold flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Head of Family Name */}
          <div>
            <div className="flex items-center gap-1.5 mb-1 text-xs font-bold text-stone-800">
              <UserCheck className="w-3.5 h-3.5 text-amber-700" />
              <span>Head of Family Name (Mukhia) *</span>
            </div>
            <Input
              value={headName}
              onChange={(e) => setHeadName(e.target.value)}
              placeholder="e.g. Ghanashyam Sahu"
              required
              className="rounded-2xl border-2 border-amber-200 bg-white font-semibold"
            />
          </div>

          {/* Number of Members */}
          <div>
            <div className="flex items-center gap-1.5 mb-1 text-xs font-bold text-stone-800">
              <Users className="w-3.5 h-3.5 text-amber-700" />
              <span>Total Members in Family (Sadasya) *</span>
            </div>
            <Input
              type="number"
              value={members.toString()}
              onChange={(e) => setMembers(parseInt(e.target.value) || 1)}
              min="1"
              max="50"
              required
              className="rounded-2xl border-2 border-amber-200 bg-white font-semibold"
            />
          </div>

          {/* Mobile Number (Unique Check) */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="flex items-center gap-1.5 text-xs font-bold text-stone-800">
                <Phone className="w-3.5 h-3.5 text-amber-700" />
                <span>Primary Mobile Number * (Must be Unique)</span>
              </span>
              {isCheckingPhone && (
                <span className="text-[10px] text-amber-700 font-bold animate-pulse">
                  Checking uniqueness...
                </span>
              )}
            </div>
            <Input
              type="tel"
              value={phone}
              onChange={handlePhoneChange}
              onBlur={handlePhoneBlur}
              placeholder="e.g. 9876543210"
              required
              maxLength={15}
              pattern="[0-9]*"
              inputMode="numeric"
              helperText="10-15 digit mobile number. Used to uniquely identify household during chanda collection."
              className={`rounded-2xl border-2 bg-white font-semibold ${
                phoneError ? 'border-rose-400 bg-rose-50/50' : 'border-amber-200'
              }`}
            />
            {phoneError && (
              <p className="text-xs font-bold text-rose-700 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{phoneError}</span>
              </p>
            )}
          </div>

          {/* Address / Ward */}
          <div>
            <div className="flex items-center gap-1.5 mb-1 text-xs font-bold text-stone-800">
              <Home className="w-3.5 h-3.5 text-amber-700" />
              <span>Village Address / Ward / Lane</span>
            </div>
            <Textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="e.g. Luhuren, Ward No. 3, Near Old Temple"
              rows={3}
              className="rounded-2xl border-2 border-amber-200 bg-white font-semibold"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-3">
            <Button 
              type="submit" 
              isLoading={loading} 
              disabled={loading || !!phoneError}
              className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 text-white font-black text-sm shadow-md hover:shadow-lg border-2 border-amber-200"
            >
              {familyId ? '✓ Update Parivar Details' : '+ Save & Register Parivar'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push(APP_ROUTES.FAMILIES)}
              className="py-3 px-5 rounded-2xl border-2 border-amber-300 bg-white hover:bg-amber-50 text-stone-800 font-bold text-xs"
            >
              Cancel
            </Button>
          </div>
        </form>

        <div className="pt-2 text-center">
          <p className="text-[10px] text-stone-500 font-medium">
            🌾 Unique mobile numbers ensure 100% duplicate-free chanda records &amp; receipts.
          </p>
        </div>
      </div>
    </div>
  );
};
