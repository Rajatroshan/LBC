import { db } from '../config/firebase.config';
import { Payment, PaymentFilter } from '@shared/models';
import { COLLECTIONS } from '@shared/constants';

export class PaymentRepository {
  private collection = db.collection(COLLECTIONS.PAYMENTS);

  async create(data: Omit<Payment, 'id' | 'createdAt' | 'updatedAt'>): Promise<Payment> {
    const now = new Date();
    const docRef = await this.collection.add({
      ...data,
      createdAt: now,
      updatedAt: now,
    });

    const doc = await docRef.get();
    return this.toEntity(doc);
  }

  async getById(id: string): Promise<Payment | null> {
    const doc = await this.collection.doc(id).get();
    if (!doc.exists) return null;
    return this.toEntity(doc);
  }

  async getAll(filter?: PaymentFilter): Promise<Payment[]> {
    let query: FirebaseFirestore.Query = this.collection;

    if (filter?.festivalId) {
      query = query.where('festivalId', '==', filter.festivalId);
    }

    if (filter?.familyId) {
      query = query.where('familyId', '==', filter.familyId);
    }

    if (filter?.status) {
      query = query.where('status', '==', filter.status);
    }

    const snapshot = await query.get();
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
    const snapshot = await this.collection
      .where('festivalId', '==', festivalId)
      .get();

    return snapshot.docs.map((doc) => this.toEntity(doc));
  }

  async update(id: string, data: Partial<Payment>): Promise<Payment> {
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

  async getRecentPayments(limit: number = 10): Promise<Payment[]> {
    const snapshot = await this.collection
      .orderBy('paidDate', 'desc')
      .limit(limit)
      .get();

    return snapshot.docs.map((doc) => this.toEntity(doc));
  }

  private toEntity(doc: FirebaseFirestore.DocumentSnapshot): Payment {
    const data = doc.data()!;
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
