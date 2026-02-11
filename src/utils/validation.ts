import { VALIDATION } from '@/core/constants';

/**
 * Validate phone number
 */
export const isValidPhone = (phone: string): boolean => {
  const cleaned = phone.replace(/\D/g, '');
  return (
    cleaned.length >= VALIDATION.PHONE_MIN_LENGTH &&
    cleaned.length <= VALIDATION.PHONE_MAX_LENGTH
  );
};

/**
 * Validate email
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate amount
 */
export const isValidAmount = (amount: number): boolean => {
  return amount >= VALIDATION.MIN_AMOUNT && amount <= VALIDATION.MAX_AMOUNT;
};
