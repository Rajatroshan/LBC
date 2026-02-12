import { DocumentData, where } from 'firebase/firestore';
import { BaseFirestoreRepository } from '@/core/shared/base-repository';
import { Expense, ExpenseFilter } from '@/core/types';
import { COLLECTIONS } from '@/core/constants';
import { IExpenseRepository } from '../../domain/repositories/expense.repository.interface';

export class FirebaseExpenseRepository
  extends BaseFirestoreRepository<Expense>
  implements IExpenseRepository
{
  constructor() {
    super(COLLECTIONS.EXPENSES);
  }

  protected toEntity(doc: DocumentData): Expense {
    return {
      id: doc.id,
      purpose: doc.purpose,
      category: doc.category,
      amount: doc.amount,
      expenseDate: doc.expenseDate?.toDate() || new Date(),
      paidTo: doc.paidTo,
      contactNumber: doc.contactNumber,
      festivalId: doc.festivalId,
      notes: doc.notes,
      receiptUrl: doc.receiptUrl,
      createdAt: doc.createdAt?.toDate() || new Date(),
      updatedAt: doc.updatedAt?.toDate() || new Date(),
    };
  }

  async getFiltered(filter: ExpenseFilter): Promise<Expense[]> {
    const constraints = [];

    if (filter.festivalId) {
      constraints.push(where('festivalId', '==', filter.festivalId));
    }

    if (filter.category) {
      constraints.push(where('category', '==', filter.category));
    }

    let expenses = await this.queryWithFilters(constraints);

    // Client-side date filtering
    if (filter.startDate) {
      expenses = expenses.filter((e) => e.expenseDate >= filter.startDate!);
    }

    if (filter.endDate) {
      expenses = expenses.filter((e) => e.expenseDate <= filter.endDate!);
    }

    return expenses;
  }

  async getTotalByFestival(festivalId: string): Promise<number> {
    const expenses = await this.queryWithFilters([where('festivalId', '==', festivalId)]);
    return expenses.reduce((sum, expense) => sum + expense.amount, 0);
  }
}
