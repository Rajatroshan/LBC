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
import { COLLECTIONS } from '@/constants';

export class ExpenseService {
  private collectionRef = collection(db, COLLECTIONS.EXPENSES);

  async create(data: Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>): Promise<Expense> {
    const now = Timestamp.now();
    const docData: Record<string, unknown> = {
      purpose: data.purpose,
      category: data.category,
      amount: data.amount,
      expenseDate: Timestamp.fromDate(data.expenseDate),
      paidTo: data.paidTo,
      paymentSource: data.paymentSource || 'MASTER_ACCOUNT',
      reimbursementStatus: data.reimbursementStatus || 'NONE',
      approvalStatus: data.approvalStatus || 'APPROVED',
      createdAt: now,
      updatedAt: now,
    };

    if (data.contactNumber) docData.contactNumber = data.contactNumber;
    if (data.festivalId) docData.festivalId = data.festivalId;
    if (data.notes) docData.notes = data.notes;
    if (data.receiptUrl) docData.receiptUrl = data.receiptUrl;
    
    // Payer Audit
    if (data.paidByUserId) docData.paidByUserId = data.paidByUserId;
    if (data.paidByUserName) docData.paidByUserName = data.paidByUserName;
    if (data.paidByUserEmail) docData.paidByUserEmail = data.paidByUserEmail;

    // Recording Audit
    if (data.recordedByUserId) docData.recordedByUserId = data.recordedByUserId;
    if (data.recordedByUserName) docData.recordedByUserName = data.recordedByUserName;
    if (data.recordedByUserEmail) docData.recordedByUserEmail = data.recordedByUserEmail;
    if (data.recordedByUserRole) docData.recordedByUserRole = data.recordedByUserRole;
    if (data.recordedAt) {
      docData.recordedAt = Timestamp.fromDate(data.recordedAt);
    } else if (data.recordedByUserId) {
      docData.recordedAt = now;
    }

    // Approval Audit
    if (data.approvedByUserId) docData.approvedByUserId = data.approvedByUserId;
    if (data.approvedByUserName) docData.approvedByUserName = data.approvedByUserName;
    if (data.approvedByUserEmail) docData.approvedByUserEmail = data.approvedByUserEmail;
    if (data.approvedByUserRole) docData.approvedByUserRole = data.approvedByUserRole;
    if (data.approvedAt) docData.approvedAt = Timestamp.fromDate(data.approvedAt);
    if (data.rejectionReason) docData.rejectionReason = data.rejectionReason;

    // Reimbursement Settlement Audit
    if (data.reimbursedByUserId) docData.reimbursedByUserId = data.reimbursedByUserId;
    if (data.reimbursedByUserName) docData.reimbursedByUserName = data.reimbursedByUserName;
    if (data.reimbursedAt) docData.reimbursedAt = Timestamp.fromDate(data.reimbursedAt);

    const docRef = await addDoc(this.collectionRef, docData);

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
    try {
      const constraints: QueryConstraint[] = [];

      if (filter?.festivalId) {
        constraints.push(where('festivalId', '==', filter.festivalId));
      }

      if (filter?.category) {
        constraints.push(where('category', '==', filter.category));
      }

      if (filter?.paymentSource) {
        constraints.push(where('paymentSource', '==', filter.paymentSource));
      }

      if (filter?.paidByUserId) {
        constraints.push(where('paidByUserId', '==', filter.paidByUserId));
      }

      const q = query(this.collectionRef, ...constraints);
      const snapshot = await getDocs(q);
      
      console.log('Expenses fetched:', snapshot.size);
      let expenses = snapshot.docs.map((doc) => this.toEntity(doc));

      // Client-side date filtering
      if (filter?.startDate) {
        expenses = expenses.filter((e) => e.expenseDate >= filter.startDate!);
      }

      if (filter?.endDate) {
        expenses = expenses.filter((e) => e.expenseDate <= filter.endDate!);
      }

      return expenses;
    } catch (error) {
      console.error('Error fetching expenses:', error);
      return [];
    }
  }

  async update(id: string, data: Partial<Expense>): Promise<void> {
    const docRef = doc(db, COLLECTIONS.EXPENSES, id);
    const updateData: Record<string, unknown> = {
      updatedAt: Timestamp.now(),
    };

    Object.entries(data).forEach(([key, val]) => {
      if (val !== undefined) {
        if (key === 'expenseDate' && val instanceof Date) {
          updateData[key] = Timestamp.fromDate(val);
        } else if (key === 'approvedAt' && val instanceof Date) {
          updateData[key] = Timestamp.fromDate(val);
        } else if (key === 'reimbursedAt' && val instanceof Date) {
          updateData[key] = Timestamp.fromDate(val);
        } else if (key === 'recordedAt' && val instanceof Date) {
          updateData[key] = Timestamp.fromDate(val);
        } else {
          updateData[key] = val;
        }
      }
    });

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
      paymentSource: data.paymentSource,

      // Payer & Recording Audit
      paidByUserId: data.paidByUserId,
      paidByUserName: data.paidByUserName,
      paidByUserEmail: data.paidByUserEmail,
      recordedByUserId: data.recordedByUserId || data.paidByUserId,
      recordedByUserName: data.recordedByUserName || data.paidByUserName,
      recordedByUserEmail: data.recordedByUserEmail || data.paidByUserEmail,
      recordedByUserRole: data.recordedByUserRole,
      recordedAt: data.recordedAt?.toDate() || data.createdAt?.toDate(),

      // Approval Audit
      reimbursementStatus: data.reimbursementStatus,
      approvalStatus: data.approvalStatus,
      approvedByUserId: data.approvedByUserId,
      approvedByUserName: data.approvedByUserName,
      approvedByUserEmail: data.approvedByUserEmail,
      approvedByUserRole: data.approvedByUserRole,
      approvedAt: data.approvedAt?.toDate(),
      rejectionReason: data.rejectionReason,

      // Settlement Audit
      reimbursedByUserId: data.reimbursedByUserId,
      reimbursedByUserName: data.reimbursedByUserName,
      reimbursedAt: data.reimbursedAt?.toDate(),

      // Update Audit
      updatedByUserId: data.updatedByUserId,
      updatedByUserName: data.updatedByUserName,

      createdAt: data.createdAt?.toDate() || new Date(),
      updatedAt: data.updatedAt?.toDate() || new Date(),
    };
  }
}

export const expenseService = new ExpenseService();
