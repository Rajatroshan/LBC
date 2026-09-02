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
import { COLLECTIONS } from '@/constants';

export class PaymentService {
  private collectionRef = collection(db, COLLECTIONS.PAYMENTS);

  async create(data: Omit<Payment, 'id' | 'createdAt' | 'updatedAt'>): Promise<Payment> {
    const now = Timestamp.now();
    
    // Sanitize object so no undefined fields are passed to Firestore
    const docData: Record<string, unknown> = {
      familyId: data.familyId,
      festivalId: data.festivalId,
      amount: data.amount,
      paidDate: Timestamp.fromDate(data.paidDate),
      status: data.status,
      receiptNumber: data.receiptNumber || '',
      notes: data.notes || '',
      createdAt: now,
      updatedAt: now,
    };

    // Recording Audit Trail
    if (data.recordedByUserId) docData.recordedByUserId = data.recordedByUserId;
    if (data.recordedByUserName) docData.recordedByUserName = data.recordedByUserName;
    if (data.recordedByUserEmail) docData.recordedByUserEmail = data.recordedByUserEmail;
    if (data.recordedByUserRole) docData.recordedByUserRole = data.recordedByUserRole;
    if (data.recordedAt) {
      docData.recordedAt = Timestamp.fromDate(data.recordedAt);
    } else if (data.recordedByUserId) {
      docData.recordedAt = now;
    }

    // Submitted Info (backward compatibility & sync)
    if (data.submittedByUserId) docData.submittedByUserId = data.submittedByUserId;
    if (data.submittedByUserName) docData.submittedByUserName = data.submittedByUserName;
    if (data.submittedByUserEmail) docData.submittedByUserEmail = data.submittedByUserEmail;
    if (data.submittedByUserRole) docData.submittedByUserRole = data.submittedByUserRole;
    if (data.submittedAt) {
      docData.submittedAt = Timestamp.fromDate(data.submittedAt);
    } else if (data.submittedByUserId) {
      docData.submittedAt = now;
    }

    // Verification Info
    if (data.verifiedByUserId) docData.verifiedByUserId = data.verifiedByUserId;
    if (data.verifiedByUserName) docData.verifiedByUserName = data.verifiedByUserName;
    if (data.verifiedByUserEmail) docData.verifiedByUserEmail = data.verifiedByUserEmail;
    if (data.verifiedByUserRole) docData.verifiedByUserRole = data.verifiedByUserRole;
    if (data.verifiedAt) docData.verifiedAt = Timestamp.fromDate(data.verifiedAt);

    const docRef = await addDoc(this.collectionRef, docData);

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
    return this.getAll({ festivalId });
  }

  async getByFamily(familyId: string): Promise<Payment[]> {
    return this.getAll({ familyId });
  }

  async getRecent(limitCount: number = 10): Promise<Payment[]> {
    const q = query(
      this.collectionRef,
      orderBy('createdAt', 'desc'),
      firestoreLimit(limitCount)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => this.toEntity(doc));
  }

  async update(id: string, data: Partial<Payment>): Promise<void> {
    const docRef = doc(db, COLLECTIONS.PAYMENTS, id);
    const updateData: Record<string, unknown> = {
      updatedAt: Timestamp.now(),
    };

    Object.entries(data).forEach(([key, val]) => {
      if (val !== undefined) {
        if (key === 'paidDate' && val instanceof Date) {
          updateData[key] = Timestamp.fromDate(val);
        } else if (key === 'verifiedAt' && val instanceof Date) {
          updateData[key] = Timestamp.fromDate(val);
        } else if (key === 'recordedAt' && val instanceof Date) {
          updateData[key] = Timestamp.fromDate(val);
        } else if (key === 'submittedAt' && val instanceof Date) {
          updateData[key] = Timestamp.fromDate(val);
        } else {
          updateData[key] = val;
        }
      }
    });

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

      // Recording Audit Trail
      recordedByUserId: data.recordedByUserId || data.submittedByUserId,
      recordedByUserName: data.recordedByUserName || data.submittedByUserName,
      recordedByUserEmail: data.recordedByUserEmail,
      recordedByUserRole: data.recordedByUserRole,
      recordedAt: data.recordedAt?.toDate() || data.createdAt?.toDate(),

      // Submitted Info
      submittedByUserId: data.submittedByUserId || data.recordedByUserId,
      submittedByUserName: data.submittedByUserName || data.recordedByUserName,
      submittedByUserEmail: data.submittedByUserEmail || data.recordedByUserEmail,
      submittedByUserRole: data.submittedByUserRole || data.recordedByUserRole,
      submittedAt: data.submittedAt?.toDate() || data.createdAt?.toDate(),

      // Verification Info
      verifiedByUserId: data.verifiedByUserId,
      verifiedByUserName: data.verifiedByUserName,
      verifiedByUserEmail: data.verifiedByUserEmail,
      verifiedByUserRole: data.verifiedByUserRole,
      verifiedAt: data.verifiedAt?.toDate(),

      // Updated Info
      updatedByUserId: data.updatedByUserId,
      updatedByUserName: data.updatedByUserName,

      createdAt: data.createdAt?.toDate() || new Date(),
      updatedAt: data.updatedAt?.toDate() || new Date(),
    };
  }
}

export const paymentService = new PaymentService();
