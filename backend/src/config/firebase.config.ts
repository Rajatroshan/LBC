import * as admin from 'firebase-admin';

// Initialize Firebase Admin SDK
admin.initializeApp();

// Export Firestore instance
export const db = admin.firestore();

// Export Auth instance
export const auth = admin.auth();

// Configure Firestore settings
db.settings({
  ignoreUndefinedProperties: true,
});

export default admin;
