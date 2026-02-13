import { ExpenseRepository } from '../repositories/expense.repository';
import { Expense, ExpenseFilter, ApiResponse } from '@shared/models';

export class ExpenseController {
  private repository: ExpenseRepository;

  constructor() {
    this.repository = new ExpenseRepository();
  }

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
  }): Promise<ApiResponse<Expense>> {
    try {
      if (!data.purpose || !data.category || !data.amount || !data.paidTo) {
        return {
          success: false,
          error: 'Purpose, category, amount, and paid to are required',
        };
      }

      const expense = await this.repository.create(data);

      return {
        success: true,
        data: expense,
        message: 'Expense recorded successfully',
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to record expense',
      };
    }
  }

  async getExpenseById(id: string): Promise<ApiResponse<Expense>> {
    try {
      const expense = await this.repository.getById(id);
      
      if (!expense) {
        return {
          success: false,
          error: 'Expense not found',
        };
      }

      return {
        success: true,
        data: expense,
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to get expense',
      };
    }
  }

  async getAllExpenses(filter?: ExpenseFilter): Promise<ApiResponse<Expense[]>> {
    try {
      const expenses = await this.repository.getAll(filter);
      
      return {
        success: true,
        data: expenses,
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to get expenses',
      };
    }
  }

  async updateExpense(id: string, data: Partial<Expense>): Promise<ApiResponse<Expense>> {
    try {
      const expense = await this.repository.update(id, data);
      
      return {
        success: true,
        data: expense,
        message: 'Expense updated successfully',
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to update expense',
      };
    }
  }

  async deleteExpense(id: string): Promise<ApiResponse<void>> {
    try {
      await this.repository.delete(id);
      
      return {
        success: true,
        message: 'Expense deleted successfully',
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to delete expense',
      };
    }
  }

  async getTotalExpensesByFestival(festivalId: string): Promise<ApiResponse<number>> {
    try {
      const total = await this.repository.getTotalByFestival(festivalId);
      
      return {
        success: true,
        data: total,
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to get total expenses',
      };
    }
  }
}
