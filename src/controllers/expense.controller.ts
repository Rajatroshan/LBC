import { expenseService } from '../services/expense.service';
import { Expense, ExpenseFilter } from '../models';

export class ExpenseController {
  async createExpense(data: {
    purpose: string;
    category: 'TENT' | 'FOOD' | 'DECORATION' | 'ENTERTAINMENT' | 'UTILITIES' | 'OTHER';
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

    return await expenseService.create(data);
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
