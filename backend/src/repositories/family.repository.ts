import { db } from '../config/firebase.config';
import { Family, FamilyFilter } from '@shared/models';
import { COLLECTIONS } from '@shared/constants';

export class FamilyRepository {
  private collection = db.collection(COLLECTIONS.FAMILIES);

  /**
   * Create a new family
   */
  async create(data: Omit<Family, 'id' | 'createdAt' | 'updatedAt'>): Promise<Family> {
    const now = new Date();
    const docRef = await this.collection.add({
      ...data,
      createdAt: now,
      updatedAt: now,
    });

    const doc = await docRef.get();
    return this.toEntity(doc);
  }

  /**
   * Get family by ID
   */
  async getById(id: string): Promise<Family | null> {
    const doc = await this.collection.doc(id).get();
    if (!doc.exists) return null;
    return this.toEntity(doc);
  }

  /**
   * Get all families with optional filters
   */
  async getAll(filter?: FamilyFilter): Promise<Family[]> {
    let query: FirebaseFirestore.Query = this.collection;

    if (filter?.isActive !== undefined) {
      query = query.where('isActive', '==', filter.isActive);
    }

    const snapshot = await query.get();
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
  async update(id: string, data: Partial<Family>): Promise<Family> {
    const now = new Date();
    await this.collection.doc(id).update({
      ...data,
      updatedAt: now,
    });

    const updatedDoc = await this.collection.doc(id).get();
    return this.toEntity(updatedDoc);
  }

  /**
   * Delete family (soft delete by setting isActive to false)
   */
  async delete(id: string): Promise<void> {
    await this.collection.doc(id).update({
      isActive: false,
      updatedAt: new Date(),
    });
  }

  /**
   * Hard delete family
   */
  async hardDelete(id: string): Promise<void> {
    await this.collection.doc(id).delete();
  }

  /**
   * Count active families
   */
  async countActive(): Promise<number> {
    const snapshot = await this.collection.where('isActive', '==', true).get();
    return snapshot.size;
  }

  /**
   * Convert Firestore document to Family entity
   */
  private toEntity(doc: FirebaseFirestore.DocumentSnapshot): Family {
    const data = doc.data()!;
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
