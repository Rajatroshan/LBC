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
import { COLLECTIONS } from '@shared/constants';

export class FestivalService {
  private collectionRef = collection(db, COLLECTIONS.FESTIVALS);

  async create(data: Omit<Festival, 'id' | 'createdAt' | 'updatedAt'>): Promise<Festival> {
    const now = Timestamp.now();
    const docRef = await addDoc(this.collectionRef, {
      ...data,
      date: Timestamp.fromDate(data.date),
      createdAt: now,
      updatedAt: now,
    });

    const docSnap = await getDoc(docRef);
    return this.toEntity(docSnap);
  }

  async getById(id: string): Promise<Festival | null> {
    const docRef = doc(db, COLLECTIONS.FESTIVALS, id);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) return null;
    return this.toEntity(docSnap);
  }

  async getAll(filter?: FestivalFilter): Promise<Festival[]> {
    const constraints: QueryConstraint[] = [];

    if (filter?.isActive !== undefined) {
      constraints.push(where('isActive', '==', filter.isActive));
    }

    if (filter?.type) {
      constraints.push(where('type', '==', filter.type));
    }

    const q = query(this.collectionRef, ...constraints);
    const snapshot = await getDocs(q);
    
    let festivals = snapshot.docs.map((doc) => this.toEntity(doc));

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
    const constraints: QueryConstraint[] = [
      where('isActive', '==', true),
      where('date', '>=', Timestamp.fromDate(now)),
      orderBy('date', 'asc')
    ];

    const q = query(this.collectionRef, ...constraints);
    const snapshot = await getDocs(q);

    return snapshot.docs.slice(0, limit).map((doc) => this.toEntity(doc));
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

    await updateDoc(docRef, updateData);
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
    return {
      id: doc.id,
      name: data.name,
      type: data.type,
      date: data.date?.toDate() || new Date(),
      amountPerFamily: data.amountPerFamily,
      description: data.description,
      isActive: data.isActive ?? true,
      createdAt: data.createdAt?.toDate() || new Date(),
      updatedAt: data.updatedAt?.toDate() || new Date(),
    };
  }
}

export const festivalService = new FestivalService();
