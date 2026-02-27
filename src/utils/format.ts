import { APP_CONSTANTS } from '@/constants';

/**
 * Format currency amount
 */
export const formatCurrency = (amount: number): string => {
  return `${APP_CONSTANTS.DEFAULT_CURRENCY}${amount.toLocaleString('en-IN')}`;
};

/**
 * Parse currency string to number
 */
export const parseCurrency = (value: string): number => {
  const cleaned = value.replace(/[^0-9.-]/g, '');
  return parseFloat(cleaned) || 0;
};

/**
 * Calculate percentage
 */
export const calculatePercentage = (value: number, total: number): number => {
  if (total === 0) return 0;
  return Math.round((value / total) * 100);
};
