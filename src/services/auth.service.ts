import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc, Timestamp } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { User } from '../models';
import { COLLECTIONS } from '@shared/constants';

export class AuthService {
  /**
   * Login with email and password
   */
  async login(email: string, password: string): Promise<FirebaseUser> {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  }

  /**
   * Register new user
   */
  async register(email: string, password: string, name: string): Promise<FirebaseUser> {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Update profile
    await updateProfile(user, { displayName: name });

    // Create user document in Firestore
    await this.createUserDocument(user.uid, email, name);

    return user;
  }

  /**
   * Logout
   */
  async logout(): Promise<void> {
    await signOut(auth);
  }

  /**
   * Get current user
   */
  getCurrentUser(): FirebaseUser | null {
    return auth.currentUser;
  }

  /**
   * Listen to auth state changes
   */
  onAuthStateChanged(callback: (user: FirebaseUser | null) => void) {
    return onAuthStateChanged(auth, callback);
  }

  /**
   * Get user document from Firestore
   */
  async getUserDocument(uid: string): Promise<User | null> {
    const docRef = doc(db, COLLECTIONS.USERS, uid);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) return null;

    const data = docSnap.data();
    return {
      id: docSnap.id,
      email: data.email,
      name: data.name,
      role: data.role,
      phone: data.phone,
      photoURL: data.photoURL,
      createdAt: data.createdAt?.toDate() || new Date(),
      updatedAt: data.updatedAt?.toDate() || new Date(),
    };
  }

  /**
   * Create user document in Firestore
   */
  private async createUserDocument(uid: string, email: string, name: string): Promise<void> {
    const now = Timestamp.now();
    await setDoc(doc(db, COLLECTIONS.USERS, uid), {
      email,
      name,
      role: 'USER', // Default role
      createdAt: now,
      updatedAt: now,
    });
  }
}

// Export singleton instance
export const authService = new AuthService();
