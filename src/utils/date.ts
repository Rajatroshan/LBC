import { format, parseISO } from 'date-fns';
import { APP_CONSTANTS } from '@/constants';

/**
 * Format date to app standard format
 */
export const formatDate = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, APP_CONSTANTS.DATE_FORMAT);
};
