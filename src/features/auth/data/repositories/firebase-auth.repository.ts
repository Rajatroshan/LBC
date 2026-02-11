import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
  updateProfile,
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { getFirebaseAuth, getFirebaseDb } from '@/core/network/firebase';
import { IAuthRepository } from '../../domain/repositories/auth.repository.interface';
import { User } from '@/core/types';
import { COLLECTIONS, UserRole } from '@/core/constants';
import { AuthenticationError, DatabaseError } from '@/core/error';

export class FirebaseAuthRepository implements IAuthRepository {
  async login(email: string, password: string): Promise<User> {
    try {
      const auth = getFirebaseAuth();
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = await this.getUserData(userCredential.user.uid);
      
      if (!user) {
        throw new AuthenticationError('User data not found');
      }
      
      return user;
    } catch (error: any) {
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        throw new AuthenticationError('Invalid email or password');
      }
      throw new AuthenticationError(error.message);
    }
  }

  async register(email: string, password: string, name: string): Promise<User> {
    try {
      const auth = getFirebaseAuth();
      const db = getFirebaseDb();
      
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      // Update Firebase profile
      await updateProfile(firebaseUser, { displayName: name });

      // Create user document in Firestore
      const userData: Omit<User, 'id'> = {
        email,
        name,
        role: UserRole.USER, // Default role
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await setDoc(doc(db, COLLECTIONS.USERS, firebaseUser.uid), userData);

      return {
        id: firebaseUser.uid,
        ...userData,
      };
    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        throw new AuthenticationError('Email already in use');
      }
      throw new AuthenticationError(error.message);
    }
  }

  async logout(): Promise<void> {
    try {
      const auth = getFirebaseAuth();
      await signOut(auth);
    } catch (error: any) {
      throw new AuthenticationError(error.message);
    }
  }

  async getCurrentUser(): Promise<User | null> {
    return new Promise((resolve, reject) => {
      const auth = getFirebaseAuth();
      
      const unsubscribe = onAuthStateChanged(
        auth,
        async (firebaseUser) => {
          unsubscribe();
          
          if (!firebaseUser) {
            resolve(null);
            return;
          }

          try {
            const user = await this.getUserData(firebaseUser.uid);
            resolve(user);
          } catch (error) {
            reject(error);
          }
        },
        (error) => {
          unsubscribe();
          reject(new AuthenticationError(error.message));
        }
      );
    });
  }

  async updateProfile(userId: string, data: Partial<User>): Promise<User> {
    try {
      const db = getFirebaseDb();
      const userRef = doc(db, COLLECTIONS.USERS, userId);
      
      await updateDoc(userRef, {
        ...data,
        updatedAt: new Date(),
      });

      const user = await this.getUserData(userId);
      if (!user) {
        throw new DatabaseError('Failed to retrieve updated user');
      }

      return user;
    } catch (error: any) {
      throw new DatabaseError(error.message);
    }
  }

  private async getUserData(uid: string): Promise<User | null> {
    try {
      const db = getFirebaseDb();
      const userDoc = await getDoc(doc(db, COLLECTIONS.USERS, uid));
      
      if (!userDoc.exists()) {
        return null;
      }

      const data = userDoc.data();
      return {
        id: userDoc.id,
        email: data.email,
        name: data.name,
        role: data.role,
        phone: data.phone,
        photoURL: data.photoURL,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      };
    } catch (error: any) {
      throw new DatabaseError(error.message);
    }
  }
}
