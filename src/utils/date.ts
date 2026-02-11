import { format, parseISO } from 'date-fns';
import { APP_CONSTANTS } from '@/core/constants';

/**
 * Format date to app standard format
 */
export const formatDate = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, APP_CONSTANTS.DATE_FORMAT);
};

/**
 * Format datetime to app standard format
 */
export const formatDateTime = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, APP_CONSTANTS.DATETIME_FORMAT);
};

/**
 * Check if date is in the past
 */
export const isPastDate = (date: Date): boolean => {
  return date < new Date();
};

/**
 * Check if date is in the future
 */
export const isFutureDate = (date: Date): boolean => {
  return date > new Date();
};

/**
 * Get year from date
 */
export const getYear = (date: Date): number => {
  return date.getFullYear();
};
