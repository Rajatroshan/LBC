import { APP_CONSTANTS } from '@/constants';

/**
 * Format currency amount
 */
export const formatCurrency = (amount: number): string => {
  return `${APP_CONSTANTS.DEFAULT_CURRENCY}${amount.toLocaleString('en-IN')}`;
};
