import { db } from '../config/firebase.config';
import { Festival, FestivalFilter } from '@shared/models';
import { COLLECTIONS } from '@shared/constants';

export class FestivalRepository {
  private collection = db.collection(COLLECTIONS.FESTIVALS);

  async create(data: Omit<Festival, 'id' | 'createdAt' | 'updatedAt'>): Promise<Festival> {
    const now = new Date();
    const docRef = await this.collection.add({
      ...data,
      createdAt: now,
      updatedAt: now,
    });

    const doc = await docRef.get();
    return this.toEntity(doc);
  }

  async getById(id: string): Promise<Festival | null> {
    const doc = await this.collection.doc(id).get();
    if (!doc.exists) return null;
    return this.toEntity(doc);
  }

  async getAll(filter?: FestivalFilter): Promise<Festival[]> {
    let query: FirebaseFirestore.Query = this.collection;

    if (filter?.isActive !== undefined) {
      query = query.where('isActive', '==', filter.isActive);
    }

    if (filter?.type) {
      query = query.where('type', '==', filter.type);
    }

    const snapshot = await query.get();
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
    const snapshot = await this.collection
      .where('isActive', '==', true)
      .where('date', '>=', now)
      .orderBy('date', 'asc')
      .limit(limit)
      .get();

    return snapshot.docs.map((doc) => this.toEntity(doc));
  }

  async update(id: string, data: Partial<Festival>): Promise<Festival> {
    await this.collection.doc(id).update({
      ...data,
      updatedAt: new Date(),
    });

    const updatedDoc = await this.collection.doc(id).get();
    return this.toEntity(updatedDoc);
  }

  async delete(id: string): Promise<void> {
    await this.collection.doc(id).update({
      isActive: false,
      updatedAt: new Date(),
    });
  }

  private toEntity(doc: FirebaseFirestore.DocumentSnapshot): Festival {
    const data = doc.data()!;
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
