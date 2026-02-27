import { familyService } from '../services/family.service';
import { festivalService } from '../services/festival.service';
import { paymentService } from '../services/payment.service';
import { expenseService } from '../services/expense.service';
import { accountService } from '../services/account.service';
import { DashboardStats } from '../models';

export class DashboardController {
  async getStats(): Promise<DashboardStats> {
    try {
      // Get all data in parallel
      const [
        allFamilies,
        allFestivals,
        upcomingFestivals,
        recentPayments,
        allPayments,
        allExpenses,
        mainAccount,
        recentTransactions,
      ] = await Promise.all([
        familyService.getAll(),
        festivalService.getAll(),
        festivalService.getUpcoming(5),
        paymentService.getRecent(10),
        paymentService.getAll(),
        expenseService.getAll(),
        accountService.getMainAccount(),
        accountService.getRecentTransactions(10),
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

      const expensesThisYear = allExpenses.filter(
        (e) => e.expenseDate.getFullYear() === currentYear
      );
      
      const totalExpenseThisYear = expensesThisYear.reduce(
        (sum, e) => sum + e.amount,
        0
      );

      const pendingPayments = allPayments.filter((p) => p.status !== 'PAID').length;

      return {
        totalFamilies: allFamilies.length,
        activeFamilies,
        totalFestivals: activeFestivals.length,
        upcomingFestivals: upcomingFestivals.length,
        totalCollectionThisYear,
        totalExpenseThisYear,
        currentBalance: mainAccount.balance,
        pendingPayments,
        recentPayments,
        upcomingFestivalsList: upcomingFestivals,
        recentTransactions,
      };
    } catch (error) {
      console.error('Error in DashboardController.getStats:', error);
      throw new Error(`Failed to load dashboard stats: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}

export const dashboardController = new DashboardController();
