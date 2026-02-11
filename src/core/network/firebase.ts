import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore, enableIndexedDbPersistence } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';

let app: FirebaseApp;
let auth: Auth;
let db: Firestore;
let storage: FirebaseStorage;

/**
 * Initialize Firebase with environment config
 */
export const initializeFirebase = (config: {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}) => {
  // Check if Firebase is already initialized
  if (getApps().length === 0) {
    app = initializeApp(config);
    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);

    // Enable offline persistence
    if (typeof window !== 'undefined') {
      enableIndexedDbPersistence(db).catch((err) => {
        if (err.code === 'failed-precondition') {
          console.warn('Multiple tabs open, persistence can only be enabled in one tab at a time.');
        } else if (err.code === 'unimplemented') {
          console.warn('The current browser does not support offline persistence');
        }
      });
    }
  }

  return { app, auth, db, storage };
};

/**
 * Get Firebase Auth instance
 */
export const getFirebaseAuth = (): Auth => {
  if (!auth) {
    throw new Error('Firebase Auth not initialized. Call initializeFirebase first.');
  }
  return auth;
};

/**
 * Get Firestore instance
 */
export const getFirebaseDb = (): Firestore => {
  if (!db) {
    throw new Error('Firestore not initialized. Call initializeFirebase first.');
  }
  return db;
};

/**
 * Get Firebase Storage instance
 */
export const getFirebaseStorage = (): FirebaseStorage => {
  if (!storage) {
    throw new Error('Firebase Storage not initialized. Call initializeFirebase first.');
  }
  return storage;
};
