import { VALIDATION } from '@/constants';

/**
 * Validate phone number - must be numeric only, 10-15 digits
 */
export const isValidPhone = (phone: string): boolean => {
  return VALIDATION.PHONE_REGEX.test(phone);
};

/**
 * Strip non-numeric characters from phone input
 */
export const sanitizePhone = (value: string): string => {
  return value.replace(/[^0-9]/g, '');
};

/**
 * Validate name length
 */
export const isValidName = (name: string): boolean => {
  const trimmed = name.trim();
  return trimmed.length >= VALIDATION.NAME_MIN_LENGTH && trimmed.length <= VALIDATION.NAME_MAX_LENGTH;
};

/**
 * Validate amount range
 */
export const isValidAmount = (amount: number): boolean => {
  return amount > VALIDATION.MIN_AMOUNT && amount <= VALIDATION.MAX_AMOUNT;
};

/**
 * Validate address length
 */
export const isValidAddress = (address: string): boolean => {
  return address.trim().length <= VALIDATION.ADDRESS_MAX_LENGTH;
};

/**
 * Format phone number for display (e.g., 9876543210 -> 98765 43210)
 */
export const formatPhone = (phone: string): string => {
  const cleaned = sanitizePhone(phone);
  if (cleaned.length === 10) {
    return `${cleaned.slice(0, 5)} ${cleaned.slice(5)}`;
  }
  return cleaned;
};

