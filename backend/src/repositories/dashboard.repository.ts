import { FamilyRepository } from './family.repository';
import { FestivalRepository } from './festival.repository';
import { PaymentRepository } from './payment.repository';
import { DashboardStats } from '@shared/models';

export class DashboardRepository {
  private familyRepo: FamilyRepository;
  private festivalRepo: FestivalRepository;
  private paymentRepo: PaymentRepository;

  constructor() {
    this.familyRepo = new FamilyRepository();
    this.festivalRepo = new FestivalRepository();
    this.paymentRepo = new PaymentRepository();
  }

  async getStats(): Promise<DashboardStats> {
    // Get all data in parallel
    const [
      allFamilies,
      allFestivals,
      upcomingFestivals,
      recentPayments,
      allPayments,
    ] = await Promise.all([
      this.familyRepo.getAll(),
      this.festivalRepo.getAll(),
      this.festivalRepo.getUpcoming(5),
      this.paymentRepo.getRecentPayments(10),
      this.paymentRepo.getAll(),
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
