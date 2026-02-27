import { 
  collection, 
  doc, 
  addDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  Timestamp,
  QueryConstraint 
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Expense, ExpenseFilter } from '../models';
import { COLLECTIONS } from '@shared/constants';

export class ExpenseService {
  private collectionRef = collection(db, COLLECTIONS.EXPENSES);

  async create(data: Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>): Promise<Expense> {
    const now = Timestamp.now();
    const docRef = await addDoc(this.collectionRef, {
      ...data,
      expenseDate: Timestamp.fromDate(data.expenseDate),
      createdAt: now,
      updatedAt: now,
    });

    const docSnap = await getDoc(docRef);
    return this.toEntity(docSnap);
  }

  async getById(id: string): Promise<Expense | null> {
    const docRef = doc(db, COLLECTIONS.EXPENSES, id);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) return null;
    return this.toEntity(docSnap);
  }

  async getAll(filter?: ExpenseFilter): Promise<Expense[]> {
    const constraints: QueryConstraint[] = [];

    if (filter?.festivalId) {
      constraints.push(where('festivalId', '==', filter.festivalId));
    }

    if (filter?.category) {
      constraints.push(where('category', '==', filter.category));
    }

    const q = query(this.collectionRef, ...constraints);
    const snapshot = await getDocs(q);
    
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

  async update(id: string, data: Partial<Expense>): Promise<void> {
    const docRef = doc(db, COLLECTIONS.EXPENSES, id);
    const updateData: Record<string, unknown> = {
      ...data,
      updatedAt: Timestamp.now(),
    };

    if (data.expenseDate) {
      updateData.expenseDate = Timestamp.fromDate(data.expenseDate);
    }

    await updateDoc(docRef, updateData);
  }

  async delete(id: string): Promise<void> {
    const docRef = doc(db, COLLECTIONS.EXPENSES, id);
    await deleteDoc(docRef);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private toEntity(doc: any): Expense {
    const data = doc.data();
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

export const expenseService = new ExpenseService();
