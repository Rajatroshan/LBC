import { 
  collection, 
  doc, 
  addDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  query, 
  where, 
  orderBy,
  Timestamp,
  QueryConstraint 
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Festival, FestivalFilter } from '../models';
import { COLLECTIONS } from '@/constants';

export class FestivalService {
  private collectionRef = collection(db, COLLECTIONS.FESTIVALS);

  async create(data: Omit<Festival, 'id' | 'createdAt' | 'updatedAt'>): Promise<Festival> {
    const now = Timestamp.now();
    const docData: Record<string, unknown> = {
      ...data,
      date: Timestamp.fromDate(data.date),
      createdAt: now,
      updatedAt: now,
    };

    if (data.endDate) {
      docData.endDate = Timestamp.fromDate(data.endDate);
    } else {
      docData.endDate = null;
    }

    const docRef = await addDoc(this.collectionRef, docData);
    const docSnap = await getDoc(docRef);
    return this.toEntity(docSnap);
  }

  async getById(id: string): Promise<Festival | null> {
    const docRef = doc(db, COLLECTIONS.FESTIVALS, id);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) return null;
    return this.toEntity(docSnap);
  }

  /**
   * Helper to check if festival date has passed (past 23:59:59 of end date)
   */
  isDatePassed(date: Date, endDate?: Date): boolean {
    const end = endDate ? new Date(endDate) : new Date(date);
    end.setHours(23, 59, 59, 999);
    return end.getTime() < Date.now();
  }

  async getAll(filter?: FestivalFilter): Promise<Festival[]> {
    const constraints: QueryConstraint[] = [];

    // Note: We don't apply where('isActive') in Firestore query because passed dates dynamically transition
    const q = query(this.collectionRef, ...constraints);
    const snapshot = await getDocs(q);
    
    let festivals = snapshot.docs.map((doc) => this.toEntity(doc));

    // Filter by computed active status (checks both manual flag & date expiration)
    if (filter?.isActive !== undefined) {
      festivals = festivals.filter((festival) => festival.isActive === filter.isActive);
    }

    // Client-side filters
    if (filter?.search) {
      const searchLower = filter.search.toLowerCase();
      festivals = festivals.filter((festival) =>
        festival.name.toLowerCase().includes(searchLower)
      );
    }

    if (filter?.year) {
      festivals = festivals.filter((festival) => festival.date.getFullYear() === filter.year);
    }

    return festivals;
  }

  async getUpcoming(limit: number = 5): Promise<Festival[]> {
    const now = new Date();
    
    // Query only by date (no composite index needed)
    const q = query(
      this.collectionRef,
      where('date', '>=', Timestamp.fromDate(now)),
      orderBy('date', 'asc')
    );
    
    const snapshot = await getDocs(q);
    
    // Filter for active festivals client-side (unexpired and not manually deactivated)
    return snapshot.docs
      .map((doc) => this.toEntity(doc))
      .filter((festival) => festival.isActive)
      .slice(0, limit);
  }

  async update(id: string, data: Partial<Festival>): Promise<void> {
    const docRef = doc(db, COLLECTIONS.FESTIVALS, id);
    const updateData: Record<string, unknown> = {
      ...data,
      updatedAt: Timestamp.now(),
    };

    if (data.date) {
      updateData.date = Timestamp.fromDate(data.date);
    }

    if (data.endDate !== undefined) {
      updateData.endDate = data.endDate ? Timestamp.fromDate(data.endDate) : null;
    }

    if (data.isActive !== undefined) {
      updateData.isActive = data.isActive;
    }

    await updateDoc(docRef, updateData);
  }

  async toggleStatus(id: string, isActive: boolean): Promise<void> {
    const docRef = doc(db, COLLECTIONS.FESTIVALS, id);
    await updateDoc(docRef, {
      isActive,
      updatedAt: Timestamp.now(),
    });
  }

  async delete(id: string): Promise<void> {
    const docRef = doc(db, COLLECTIONS.FESTIVALS, id);
    await updateDoc(docRef, {
      isActive: false,
      updatedAt: Timestamp.now(),
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private toEntity(doc: any): Festival {
    const data = doc.data();
    const date = data.date?.toDate() || new Date();
    const endDate = data.endDate ? data.endDate.toDate() : undefined;
    const isPast = this.isDatePassed(date, endDate);

    // Festival is active only if:
    // 1. Not manually marked as inactive by admin (data.isActive !== false)
    // 2. Its date/end-date has not passed (!isPast)
    const isActive = data.isActive === false ? false : !isPast;

    return {
      id: doc.id,
      name: data.name,
      type: data.type,
      date,
      endDate,
      isMultiDay: data.isMultiDay ?? (Boolean(data.endDate)),
      amountPerFamily: data.amountPerFamily,
      description: data.description,
      isActive,
      createdAt: data.createdAt?.toDate() || new Date(),
      updatedAt: data.updatedAt?.toDate() || new Date(),
    };
  }
}

export const festivalService = new FestivalService();
