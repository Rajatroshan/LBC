import { DashboardRepository } from '../data/repositories/dashboard.repository';
import { GetDashboardStatsUseCase } from '../domain/usecases/get-dashboard-stats.usecase';

class DashboardContainer {
  private _dashboardRepository: DashboardRepository | null = null;

  dashboardRepository(): DashboardRepository {
    if (!this._dashboardRepository) {
      this._dashboardRepository = new DashboardRepository();
    }
    return this._dashboardRepository;
  }

  getDashboardStatsUseCase(): GetDashboardStatsUseCase {
    return new GetDashboardStatsUseCase(this.dashboardRepository());
  }
}

export const dashboardContainer = new DashboardContainer();
