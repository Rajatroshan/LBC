import { expenseService } from '../services/expense.service';
import { accountService } from '../services/account.service';
import { Expense, ExpenseFilter } from '../models';

export class ExpenseController {
  async createExpense(data: {
    purpose: string;
    category: 'TENT' | 'FOOD' | 'DECORATION' | 'ENTERTAINMENT' | 'UTILITIES' | 'TRANSPORT' | 'SOUND_LIGHT' | 'PRIEST' | 'OTHER';
    amount: number;
    expenseDate: Date;
    paidTo: string;
    contactNumber?: string;
    festivalId?: string;
    notes?: string;
    receiptUrl?: string;
  }): Promise<Expense> {
    // Validation
    if (!data.purpose || !data.category || !data.amount || !data.paidTo) {
      throw new Error('Purpose, category, amount, and paid to are required');
    }

    if (data.amount <= 0) {
      throw new Error('Amount must be positive');
    }

    const expense = await expenseService.create(data);

    // Deduct from account
    try {
      const description = `Expense: ${data.purpose} - Paid to ${data.paidTo}`;
      
      await accountService.deductExpense({
        amount: data.amount,
        description,
        referenceId: expense.id,
        date: data.expenseDate,
      });
    } catch (error) {
      console.error('Error deducting expense from account:', error);
      // Expense still created even if account update fails
    }

    return expense;
  }

  async getExpenseById(id: string): Promise<Expense> {
    const expense = await expenseService.getById(id);
    
    if (!expense) {
      throw new Error('Expense not found');
    }

    return expense;
  }

  async getAllExpenses(filter?: ExpenseFilter): Promise<Expense[]> {
    return await expenseService.getAll(filter);
  }

  async updateExpense(id: string, data: Partial<Expense>): Promise<void> {
    await expenseService.update(id, data);
  }

  async deleteExpense(id: string): Promise<void> {
    await expenseService.delete(id);
  }
}

export const expenseController = new ExpenseController();
