import { familyService } from '../services/family.service';
import { festivalService } from '../services/festival.service';
import { paymentService } from '../services/payment.service';
import { DashboardStats } from '../models';

export class DashboardController {
  async getStats(): Promise<DashboardStats> {
    // Get all data in parallel
    const [
      allFamilies,
      allFestivals,
      upcomingFestivals,
      recentPayments,
      allPayments,
    ] = await Promise.all([
      familyService.getAll(),
      festivalService.getAll(),
      festivalService.getUpcoming(5),
      paymentService.getRecent(10),
      paymentService.getAll(),
    ]);

    // Calculate stats
    const activeFamilies = allFamilies.filter((f) => f.isActive).length;
    const activeFestivals = allFestivals.filter((f) => f.isActive);
    
    // Get current year
    const currentYear = new Date().getFullYear();
    const paymentsThisYear = allPayments.filter(
      (p) => p.paidDate.getFullYear() === currentYear && p.status === 'PAID'
    );
    
    const totalCollectionThisYear = paymentsThisYear.reduce(
      (sum, p) => sum + p.amount,
      0
    );

    const pendingPayments = allPayments.filter((p) => p.status !== 'PAID').length;

    return {
      totalFamilies: allFamilies.length,
      activeFamilies,
      totalFestivals: activeFestivals.length,
      upcomingFestivals: upcomingFestivals.length,
      totalCollectionThisYear,
      pendingPayments,
      recentPayments,
      upcomingFestivalsList: upcomingFestivals,
    };
  }
}

export const dashboardController = new DashboardController();
