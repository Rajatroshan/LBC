import { auth, db } from '../config/firebase.config';
import { User } from '@shared/models';
import { COLLECTIONS } from '@shared/constants';

export class AuthRepository {
  private collection = db.collection(COLLECTIONS.USERS);

  async createUser(uid: string, email: string, name: string, role: 'ADMIN' | 'USER' = 'USER'): Promise<User> {
    const now = new Date();
    const userData = {
      email,
      name,
      role,
      createdAt: now,
      updatedAt: now,
    };

    await this.collection.doc(uid).set(userData);
    
    return {
      id: uid,
      ...userData,
    };
  }

  async getUserById(uid: string): Promise<User | null> {
    const doc = await this.collection.doc(uid).get();
    if (!doc.exists) return null;
    
    const data = doc.data()!;
    return {
      id: doc.id,
      email: data.email,
      name: data.name,
      role: data.role,
      phone: data.phone,
      photoURL: data.photoURL,
      createdAt: data.createdAt?.toDate() || new Date(),
      updatedAt: data.updatedAt?.toDate() || new Date(),
    };
  }

  async updateUser(uid: string, data: Partial<User>): Promise<User> {
    await this.collection.doc(uid).update({
      ...data,
      updatedAt: new Date(),
    });

    const user = await this.getUserById(uid);
    return user!;
  }

  async deleteUser(uid: string): Promise<void> {
    await auth.deleteUser(uid);
    await this.collection.doc(uid).delete();
  }
}
