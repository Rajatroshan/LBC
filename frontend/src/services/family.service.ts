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
import { Family, FamilyFilter } from '../models';
import { COLLECTIONS } from '@shared/constants';

export class FamilyService {
  private collectionRef = collection(db, COLLECTIONS.FAMILIES);

  /**
   * Create a new family
   */
  async create(data: Omit<Family, 'id' | 'createdAt' | 'updatedAt'>): Promise<Family> {
    const now = Timestamp.now();
    const docRef = await addDoc(this.collectionRef, {
      ...data,
      createdAt: now,
      updatedAt: now,
    });

    const docSnap = await getDoc(docRef);
    return this.toEntity(docSnap);
  }

  /**
   * Get family by ID
   */
  async getById(id: string): Promise<Family | null> {
    const docRef = doc(db, COLLECTIONS.FAMILIES, id);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) return null;
    return this.toEntity(docSnap);
  }

  /**
   * Get all families with optional filters
   */
  async getAll(filter?: FamilyFilter): Promise<Family[]> {
    const constraints: QueryConstraint[] = [];

    if (filter?.isActive !== undefined) {
      constraints.push(where('isActive', '==', filter.isActive));
    }

    const q = query(this.collectionRef, ...constraints);
    const snapshot = await getDocs(q);
    
    let families = snapshot.docs.map((doc) => this.toEntity(doc));

    // Client-side search filter
    if (filter?.search) {
      const searchLower = filter.search.toLowerCase();
      families = families.filter(
        (family) =>
          family.headName.toLowerCase().includes(searchLower) ||
          family.phone.includes(searchLower)
      );
    }

    return families;
  }

  /**
   * Update family
   */
  async update(id: string, data: Partial<Family>): Promise<void> {
    const docRef = doc(db, COLLECTIONS.FAMILIES, id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: Timestamp.now(),
    });
  }

  /**
   * Delete family (soft delete)
   */
  async delete(id: string): Promise<void> {
    const docRef = doc(db, COLLECTIONS.FAMILIES, id);
    await updateDoc(docRef, {
      isActive: false,
      updatedAt: Timestamp.now(),
    });
  }

  /**
   * Hard delete family
   */
  async hardDelete(id: string): Promise<void> {
    const docRef = doc(db, COLLECTIONS.FAMILIES, id);
    await deleteDoc(docRef);
  }

  /**
   * Convert Firestore document to Family entity
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private toEntity(doc: any): Family {
    const data = doc.data();
    return {
      id: doc.id,
      headName: data.headName,
      members: data.members,
      phone: data.phone,
      address: data.address,
      isActive: data.isActive ?? true,
      createdAt: data.createdAt?.toDate() || new Date(),
      updatedAt: data.updatedAt?.toDate() || new Date(),
    };
  }
}

// Export singleton instance
export const familyService = new FamilyService();
