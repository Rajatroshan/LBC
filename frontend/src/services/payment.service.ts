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
  orderBy,
  Timestamp,
  QueryConstraint,
  limit as firestoreLimit
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Payment, PaymentFilter } from '../models';
import { COLLECTIONS } from '@shared/constants';

export class PaymentService {
  private collectionRef = collection(db, COLLECTIONS.PAYMENTS);

  async create(data: Omit<Payment, 'id' | 'createdAt' | 'updatedAt'>): Promise<Payment> {
    const now = Timestamp.now();
    const docRef = await addDoc(this.collectionRef, {
      ...data,
      paidDate: Timestamp.fromDate(data.paidDate),
      createdAt: now,
      updatedAt: now,
    });

    const docSnap = await getDoc(docRef);
    return this.toEntity(docSnap);
  }

  async getById(id: string): Promise<Payment | null> {
    const docRef = doc(db, COLLECTIONS.PAYMENTS, id);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) return null;
    return this.toEntity(docSnap);
  }

  async getAll(filter?: PaymentFilter): Promise<Payment[]> {
    const constraints: QueryConstraint[] = [];

    if (filter?.festivalId) {
      constraints.push(where('festivalId', '==', filter.festivalId));
    }

    if (filter?.familyId) {
      constraints.push(where('familyId', '==', filter.familyId));
    }

    if (filter?.status) {
      constraints.push(where('status', '==', filter.status));
    }

    const q = query(this.collectionRef, ...constraints);
    const snapshot = await getDocs(q);
    
    let payments = snapshot.docs.map((doc) => this.toEntity(doc));

    // Client-side date filtering
    if (filter?.startDate) {
      payments = payments.filter((p) => p.paidDate >= filter.startDate!);
    }

    if (filter?.endDate) {
      payments = payments.filter((p) => p.paidDate <= filter.endDate!);
    }

    return payments;
  }

  async getByFestival(festivalId: string): Promise<Payment[]> {
    const q = query(this.collectionRef, where('festivalId', '==', festivalId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => this.toEntity(doc));
  }

  async getRecent(limit: number = 10): Promise<Payment[]> {
    const q = query(
      this.collectionRef,
      orderBy('paidDate', 'desc'),
      firestoreLimit(limit)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => this.toEntity(doc));
  }

  async update(id: string, data: Partial<Payment>): Promise<void> {
    const docRef = doc(db, COLLECTIONS.PAYMENTS, id);
    const updateData: Record<string, unknown> = {
      ...data,
      updatedAt: Timestamp.now(),
    };

    if (data.paidDate) {
      updateData.paidDate = Timestamp.fromDate(data.paidDate);
    }

    await updateDoc(docRef, updateData);
  }

  async delete(id: string): Promise<void> {
    const docRef = doc(db, COLLECTIONS.PAYMENTS, id);
    await deleteDoc(docRef);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private toEntity(doc: any): Payment {
    const data = doc.data();
    return {
      id: doc.id,
      familyId: data.familyId,
      festivalId: data.festivalId,
      amount: data.amount,
      paidDate: data.paidDate?.toDate() || new Date(),
      status: data.status,
      receiptNumber: data.receiptNumber,
      notes: data.notes,
      createdAt: data.createdAt?.toDate() || new Date(),
      updatedAt: data.updatedAt?.toDate() || new Date(),
    };
  }
}

export const paymentService = new PaymentService();
