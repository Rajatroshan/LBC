import { DashboardStats } from '@/core/types';
import { IDashboardRepository } from '../../domain/repositories/dashboard.repository.interface';
import { familyContainer } from '@/features/family/di/family.container';
import { festivalContainer } from '@/features/festival/di/festival.container';
import { paymentContainer } from '@/features/payments/di/payment.container';

export class DashboardRepository implements IDashboardRepository {
  async getStats(): Promise<DashboardStats> {
    const familyRepo = familyContainer.familyRepository();
    const festivalRepo = festivalContainer.festivalRepository();
    const paymentRepo = paymentContainer.paymentRepository();

    // Get all data in parallel
    const [families, festivals, allPayments] = await Promise.all([
      familyRepo.getAll(),
      festivalRepo.getAll(),
      paymentRepo.getAll(),
    ]);

    const activeFamilies = families.filter((f) => f.isActive);
    const upcomingFestivals = festivals
      .filter((f) => f.isActive && f.date >= new Date())
      .sort((a, b) => a.date.getTime() - b.date.getTime());

    const currentYear = new Date().getFullYear();
    const paymentsThisYear = allPayments.filter(
      (p) => p.paidDate.getFullYear() === currentYear
    );

    const totalCollectionThisYear = paymentsThisYear.reduce(
      (sum, p) => sum + p.amount,
      0
    );

    const recentPayments = allPayments
      .sort((a, b) => b.paidDate.getTime() - a.paidDate.getTime())
      .slice(0, 5);

    const pendingPaymentsCount = allPayments.filter(
      (p) => p.status === 'UNPAID' || p.status === 'PENDING'
    ).length;

    return {
      totalFamilies: families.length,
      activeFamilies: activeFamilies.length,
      totalFestivals: festivals.length,
      upcomingFestivals: upcomingFestivals.length,
      totalCollectionThisYear,
      pendingPayments: pendingPaymentsCount,
      recentPayments,
      upcomingFestivalsList: upcomingFestivals.slice(0, 5),
    };
  }
}
