import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  Timestamp,
  QueryConstraint,
  DocumentData,
} from 'firebase/firestore';
import { getFirebaseDb } from '@/core/network/firebase';
import { IRepository } from '@/core/shared/interfaces';
import { BaseEntity } from '@/core/types';
import { DatabaseError, NotFoundError } from '@/core/error';

/**
 * Base Firestore Repository
 * Provides common CRUD operations for Firestore collections
 */
export abstract class BaseFirestoreRepository<T extends BaseEntity> implements IRepository<T> {
  protected collectionName: string;

  constructor(collectionName: string) {
    this.collectionName = collectionName;
  }

  /**
   * Convert Firestore document to entity
   */
  protected abstract toEntity(doc: DocumentData): T;

  /**
   * Convert entity to Firestore document
   */
  protected toDocument(data: Partial<T>): DocumentData {
    const doc: DocumentData = { ...data };
    
    // Convert Date objects to Firestore Timestamps
    if (doc.createdAt instanceof Date) {
      doc.createdAt = Timestamp.fromDate(doc.createdAt);
    }
    if (doc.updatedAt instanceof Date) {
      doc.updatedAt = Timestamp.fromDate(doc.updatedAt);
    }
    
    return doc;
  }

  async getById(id: string): Promise<T | null> {
    try {
      const db = getFirebaseDb();
      const docRef = doc(db, this.collectionName, id);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        return null;
      }

      return this.toEntity({ id: docSnap.id, ...docSnap.data() });
    } catch (error) {
      throw new DatabaseError(`Failed to get ${this.collectionName} by id: ${id}`, error);
    }
  }

  async getAll(): Promise<T[]> {
    try {
      const db = getFirebaseDb();
      const collectionRef = collection(db, this.collectionName);
      const querySnapshot = await getDocs(collectionRef);

      return querySnapshot.docs.map((doc) =>
        this.toEntity({ id: doc.id, ...doc.data() })
      );
    } catch (error) {
      throw new DatabaseError(`Failed to get all ${this.collectionName}`, error);
    }
  }

  async create(data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): Promise<T> {
    try {
      const db = getFirebaseDb();
      const collectionRef = collection(db, this.collectionName);
      
      const now = new Date();
      const docData = this.toDocument({
        ...data,
        createdAt: now,
        updatedAt: now,
      } as Partial<T>);

      const docRef = await addDoc(collectionRef, docData);
      const created = await this.getById(docRef.id);

      if (!created) {
        throw new DatabaseError(`Failed to retrieve created ${this.collectionName}`);
      }

      return created;
    } catch (error) {
      throw new DatabaseError(`Failed to create ${this.collectionName}`, error);
    }
  }

  async update(id: string, data: Partial<T>): Promise<T> {
    try {
      const db = getFirebaseDb();
      const docRef = doc(db, this.collectionName, id);
      
      const updateData = this.toDocument({
        ...data,
        updatedAt: new Date(),
      });

      await updateDoc(docRef, updateData);
      const updated = await this.getById(id);

      if (!updated) {
        throw new NotFoundError(this.collectionName);
      }

      return updated;
    } catch (error) {
      throw new DatabaseError(`Failed to update ${this.collectionName}`, error);
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const db = getFirebaseDb();
      const docRef = doc(db, this.collectionName, id);
      await deleteDoc(docRef);
    } catch (error) {
      throw new DatabaseError(`Failed to delete ${this.collectionName}`, error);
    }
  }

  /**
   * Query with filters
   */
  protected async queryWithFilters(constraints: QueryConstraint[]): Promise<T[]> {
    try {
      const db = getFirebaseDb();
      const collectionRef = collection(db, this.collectionName);
      const q = query(collectionRef, ...constraints);
      const querySnapshot = await getDocs(q);

      return querySnapshot.docs.map((doc) =>
        this.toEntity({ id: doc.id, ...doc.data() })
      );
    } catch (error) {
      throw new DatabaseError(`Failed to query ${this.collectionName}`, error);
    }
  }
}
