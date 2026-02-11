import { DashboardStats } from '@/core/types';

export interface IDashboardRepository {
  getStats(): Promise<DashboardStats>;
}
