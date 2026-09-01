import { familyService } from '../services/family.service';
import { festivalService } from '../services/festival.service';
import { paymentService } from '../services/payment.service';
import { expenseService } from '../services/expense.service';
import { accountService } from '../services/account.service';
import { DashboardStats } from '../models';

export class DashboardController {
  async getStats(): Promise<DashboardStats> {
    try {
      // Get all core datasets concurrently
      const [
        allFamilies,
        allFestivals,
        upcomingFestivals,
        recentPaymentsRaw,
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

      // Calculate family statistics
      const activeFamilies = allFamilies.filter((f) => f.isActive).length;
      
      // Calculate festival statistics (unexpired & active)
      const activeFestivals = allFestivals.filter((f) => f.isActive);
      
      // Calculate current year collections & expenses
      const currentYear = new Date().getFullYear();
      
      const paymentsThisYear = allPayments.filter(
        (p) => p.paidDate.getFullYear() === currentYear && p.status === 'PAID'
      );
      
      const totalCollectionThisYear = paymentsThisYear.reduce(
        (sum, p) => sum + p.amount,
        0
      );

      const allTimeCollection = allPayments
        .filter((p) => p.status === 'PAID')
        .reduce((sum, p) => sum + p.amount, 0);

      const expensesThisYear = allExpenses.filter(
        (e) => e.expenseDate.getFullYear() === currentYear
      );
      
      const totalExpenseThisYear = expensesThisYear.reduce(
        (sum, e) => sum + e.amount,
        0
      );

      const allTimeExpense = allExpenses.reduce((sum, e) => sum + e.amount, 0);

      // Current balance: use synced balance from account or true net balance (allTimeCollection - allTimeExpense)
      const computedNetBalance = allTimeCollection - allTimeExpense;
      const currentBalance = mainAccount.balance !== 0 ? mainAccount.balance : computedNetBalance;

      // Pending payments count
      const pendingPayments = allPayments.filter((p) => p.status !== 'PAID').length;

      // Map families & festivals for human-readable recent payments
      const familyMap = new Map(allFamilies.map((f) => [f.id, f.headName]));
      const festivalMap = new Map(allFestivals.map((f) => [f.id, f.name]));

      const recentPayments = recentPaymentsRaw.map((payment) => ({
        ...payment,
        familyName: familyMap.get(payment.familyId) || 'Family Member',
        festivalName: festivalMap.get(payment.festivalId) || 'Festival Contribution',
      }));

      return {
        totalFamilies: allFamilies.length,
        activeFamilies,
        totalFestivals: allFestivals.length,
        activeFestivalsCount: activeFestivals.length,
        upcomingFestivals: upcomingFestivals.length,
        totalCollectionThisYear,
        totalExpenseThisYear,
        allTimeCollection,
        allTimeExpense,
        currentBalance,
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
