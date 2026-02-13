import { DashboardRepository } from '../repositories/dashboard.repository';
import { DashboardStats, ApiResponse } from '@shared/models';

export class DashboardController {
  private repository: DashboardRepository;

  constructor() {
    this.repository = new DashboardRepository();
  }

  async getStats(): Promise<ApiResponse<DashboardStats>> {
    try {
      const stats = await this.repository.getStats();
      
      return {
        success: true,
        data: stats,
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to get dashboard stats',
      };
    }
  }
}
