import { db } from '../config/firebase.config';
import { Expense, ExpenseFilter } from '@shared/models';
import { COLLECTIONS } from '@shared/constants';

export class ExpenseRepository {
  private collection = db.collection(COLLECTIONS.EXPENSES);

  async create(data: Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>): Promise<Expense> {
    const now = new Date();
    const docRef = await this.collection.add({
      ...data,
      createdAt: now,
      updatedAt: now,
    });

    const doc = await docRef.get();
    return this.toEntity(doc);
  }

  async getById(id: string): Promise<Expense | null> {
    const doc = await this.collection.doc(id).get();
    if (!doc.exists) return null;
    return this.toEntity(doc);
  }

  async getAll(filter?: ExpenseFilter): Promise<Expense[]> {
    let query: FirebaseFirestore.Query = this.collection;

    if (filter?.festivalId) {
      query = query.where('festivalId', '==', filter.festivalId);
    }

    if (filter?.category) {
      query = query.where('category', '==', filter.category);
    }

    const snapshot = await query.get();
    let expenses = snapshot.docs.map((doc) => this.toEntity(doc));

    // Client-side date filtering
    if (filter?.startDate) {
      expenses = expenses.filter((e) => e.expenseDate >= filter.startDate!);
    }

    if (filter?.endDate) {
      expenses = expenses.filter((e) => e.expenseDate <= filter.endDate!);
    }

    return expenses;
  }

  async update(id: string, data: Partial<Expense>): Promise<Expense> {
    await this.collection.doc(id).update({
      ...data,
      updatedAt: new Date(),
    });

    const updatedDoc = await this.collection.doc(id).get();
    return this.toEntity(updatedDoc);
  }

  async delete(id: string): Promise<void> {
    await this.collection.doc(id).delete();
  }

  async getTotalByFestival(festivalId: string): Promise<number> {
    const expenses = await this.getAll({ festivalId });
    return expenses.reduce((sum, expense) => sum + expense.amount, 0);
  }

  private toEntity(doc: FirebaseFirestore.DocumentSnapshot): Expense {
    const data = doc.data()!;
    return {
      id: doc.id,
      purpose: data.purpose,
      category: data.category,
      amount: data.amount,
      expenseDate: data.expenseDate?.toDate() || new Date(),
      paidTo: data.paidTo,
      contactNumber: data.contactNumber,
      festivalId: data.festivalId,
      notes: data.notes,
      receiptUrl: data.receiptUrl,
      createdAt: data.createdAt?.toDate() || new Date(),
      updatedAt: data.updatedAt?.toDate() || new Date(),
    };
  }
}
