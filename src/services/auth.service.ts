import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
  updateProfile,
  signInWithPopup,
  GoogleAuthProvider,
  GithubAuthProvider
} from 'firebase/auth';
import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  collection, 
  query, 
  getDocs, 
  orderBy, 
  Timestamp 
} from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { User } from '../models';
import { COLLECTIONS } from '@/constants';

export const PRIMARY_ADMIN_EMAILS = [
  'rajatroshan2002@gmail.com'
];

export class AuthService {
  /**
   * Login with email and password
   */
  async login(email: string, password: string): Promise<FirebaseUser> {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  }

  /**
   * Seamless single-platform authentication:
   * 1. Attempts sign in with email & password.
   * 2. If the user doesn't exist yet, automatically creates the account,
   *    sets up the profile, and initializes the Firestore user record with PENDING_APPROVAL.
   */
  async loginOrRegister(
    email: string, 
    password: string, 
    name?: string
  ): Promise<{ user: FirebaseUser; isNewUser: boolean }> {
    try {
      // 1. Try to sign in directly
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Ensure Firestore document exists
      const docRef = doc(db, COLLECTIONS.USERS, user.uid);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) {
        await this.createUserDocument(
          user.uid, 
          email, 
          user.displayName || name || email.split('@')[0]
        );
      }

      return { user, isNewUser: false };
    } catch (err: unknown) {
      const authError = err as { code?: string; message?: string };
      const code = authError.code || '';

      // If user does not exist or credentials not recognized, attempt automatic registration
      if (
        code === 'auth/user-not-found' ||
        code === 'auth/invalid-credential'
      ) {
        try {
          const userCredential = await createUserWithEmailAndPassword(auth, email, password);
          const user = userCredential.user;
          const displayName = name || email.split('@')[0];

          await updateProfile(user, { displayName });
          await this.createUserDocument(user.uid, email, displayName);

          return { user, isNewUser: true };
        } catch (createErr: unknown) {
          const createError = createErr as { code?: string; message?: string };
          if (createError.code === 'auth/email-already-in-use') {
            throw new Error('Incorrect password for this account. Please try again.');
          } else if (createError.code === 'auth/weak-password') {
            throw new Error('Password must be at least 6 characters.');
          } else if (createError.code === 'auth/invalid-email') {
            throw new Error('Please enter a valid email address.');
          }
          throw createErr;
        }
      }

      if (code === 'auth/wrong-password') {
        throw new Error('Incorrect password. Please try again.');
      } else if (code === 'auth/invalid-email') {
        throw new Error('Please enter a valid email address.');
      } else if (code === 'auth/too-many-requests') {
        throw new Error('Access to this account has been temporarily disabled due to many failed attempts. Please try again later.');
      }

      throw err;
    }
  }

  /**
   * Register new user (default approvalStatus is PENDING_APPROVAL)
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
   * Sign in with Google OAuth
   */
  async loginWithGoogle(): Promise<FirebaseUser> {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    const userCredential = await signInWithPopup(auth, provider);
    const user = userCredential.user;

    await this.syncOAuthUserDocument(user);
    return user;
  }

  /**
   * Sign in with GitHub OAuth
   */
  async loginWithGithub(): Promise<FirebaseUser> {
    const provider = new GithubAuthProvider();
    const userCredential = await signInWithPopup(auth, provider);
    const user = userCredential.user;

    await this.syncOAuthUserDocument(user);
    return user;
  }

  /**
   * Synchronize OAuth / authenticated user with Firestore user document
   */
  async syncOAuthUserDocument(user: FirebaseUser): Promise<void> {
    const docRef = doc(db, COLLECTIONS.USERS, user.uid);
    const docSnap = await getDoc(docRef);
    const email = user.email || '';
    const isPrimaryAdmin = PRIMARY_ADMIN_EMAILS.includes(email.toLowerCase());

    if (!docSnap.exists()) {
      // First time login - create user document
      const now = Timestamp.now();
      await setDoc(docRef, {
        email,
        name: user.displayName || email.split('@')[0] || 'User',
        role: isPrimaryAdmin ? 'ADMIN' : 'USER',
        approvalStatus: isPrimaryAdmin ? 'APPROVED' : 'PENDING_APPROVAL',
        photoURL: user.photoURL || '',
        phone: user.phoneNumber || '',
        createdAt: now,
        updatedAt: now,
      });
    } else {
      // Existing user - update updatedAt and photoURL / name if missing
      const data = docSnap.data();
      const updates: Record<string, unknown> = {
        updatedAt: Timestamp.now(),
      };
      if (isPrimaryAdmin && data.role !== 'ADMIN') {
        updates.role = 'ADMIN';
        updates.approvalStatus = 'APPROVED';
      }
      if (!data.photoURL && user.photoURL) {
        updates.photoURL = user.photoURL;
      }
      if (!data.name && user.displayName) {
        updates.name = user.displayName;
      }
      await updateDoc(docRef, updates);
    }
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
   * Get user document from Firestore with approvalStatus mapping
   */
  async getUserDocument(uid: string): Promise<User | null> {
    const docRef = doc(db, COLLECTIONS.USERS, uid);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) return null;

    const data = docSnap.data();
    const isPrimaryAdmin = PRIMARY_ADMIN_EMAILS.includes((data.email || '').toLowerCase());
    const role = isPrimaryAdmin ? 'ADMIN' : (data.role || 'USER');
    const approvalStatus = isPrimaryAdmin 
      ? 'APPROVED' 
      : (data.approvalStatus || (data.role === 'ADMIN' ? 'APPROVED' : 'PENDING_APPROVAL'));

    return {
      id: docSnap.id,
      email: data.email,
      name: data.name,
      role,
      phone: data.phone,
      photoURL: data.photoURL,
      approvalStatus,
      approvedByUserId: data.approvedByUserId,
      approvedByUserName: data.approvedByUserName,
      approvedByUserEmail: data.approvedByUserEmail,
      approvedAt: data.approvedAt?.toDate(),
      rejectionReason: data.rejectionReason,
      createdAt: data.createdAt?.toDate() || new Date(),
      updatedAt: data.updatedAt?.toDate() || new Date(),
    };
  }

  /**
   * Create user document in Firestore
   */
  private async createUserDocument(uid: string, email: string, name: string): Promise<void> {
    const now = Timestamp.now();
    const isPrimaryAdmin = PRIMARY_ADMIN_EMAILS.includes(email.toLowerCase());
    await setDoc(doc(db, COLLECTIONS.USERS, uid), {
      email,
      name,
      role: isPrimaryAdmin ? 'ADMIN' : 'USER',
      approvalStatus: isPrimaryAdmin ? 'APPROVED' : 'PENDING_APPROVAL',
      createdAt: now,
      updatedAt: now,
    });
  }

  /**
   * Fetch all users from Firestore (For Admin Member Management)
   */
  async getAllUsers(): Promise<User[]> {
    try {
      const q = query(collection(db, COLLECTIONS.USERS), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(docSnap => {
        const data = docSnap.data();
        const isPrimaryAdmin = PRIMARY_ADMIN_EMAILS.includes((data.email || '').toLowerCase());
        const role = isPrimaryAdmin ? 'ADMIN' : (data.role || 'USER');
        const approvalStatus = isPrimaryAdmin 
          ? 'APPROVED' 
          : (data.approvalStatus || (data.role === 'ADMIN' ? 'APPROVED' : 'PENDING_APPROVAL'));

        return {
          id: docSnap.id,
          email: data.email || '',
          name: data.name || 'User',
          role,
          phone: data.phone,
          photoURL: data.photoURL,
          approvalStatus,
          approvedByUserId: data.approvedByUserId,
          approvedByUserName: data.approvedByUserName,
          approvedByUserEmail: data.approvedByUserEmail,
          approvedAt: data.approvedAt?.toDate(),
          rejectionReason: data.rejectionReason,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
        };
      });
    } catch (err) {
      console.error('Failed to get all users:', err);
      return [];
    }
  }

  /**
   * Approve a pending member
   */
  async approveUser(userId: string, adminUser: { id: string; name: string; email: string }): Promise<void> {
    const docRef = doc(db, COLLECTIONS.USERS, userId);
    await updateDoc(docRef, {
      approvalStatus: 'APPROVED',
      approvedByUserId: adminUser.id,
      approvedByUserName: adminUser.name,
      approvedByUserEmail: adminUser.email,
      approvedAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
  }

  /**
   * Reject a member registration
   */
  async rejectUser(userId: string, reason: string, adminUser: { id: string; name: string; email: string }): Promise<void> {
    const docRef = doc(db, COLLECTIONS.USERS, userId);
    await updateDoc(docRef, {
      approvalStatus: 'REJECTED',
      rejectionReason: reason || 'Not approved by village committee admin',
      approvedByUserId: adminUser.id,
      approvedByUserName: adminUser.name,
      approvedByUserEmail: adminUser.email,
      approvedAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
  }
}

// Export singleton instance
export const authService = new AuthService();
