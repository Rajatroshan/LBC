import { IUseCase } from '@/core/shared/interfaces';
import { DashboardStats } from '@/core/types';
import { IDashboardRepository } from '../repositories/dashboard.repository.interface';

export class GetDashboardStatsUseCase implements IUseCase<void, DashboardStats> {
  constructor(private dashboardRepository: IDashboardRepository) {}

  async execute(): Promise<DashboardStats> {
    return await this.dashboardRepository.getStats();
  }
}
