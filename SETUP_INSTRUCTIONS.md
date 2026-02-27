# LBC Setup Instructions

## Prerequisites
- Node.js 18+ installed
- Firebase project created
- Firebase CLI installed globally: `npm install -g firebase-tools`

## Setup Steps

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
The `.env.local` file already contains your Firebase configuration. Verify these values match your Firebase project settings.

### 3. Deploy Firestore Security Rules
```bash
# Login to Firebase
firebase login

# Initialize Firebase (if not done)
firebase init firestore

# Deploy rules and indexes
firebase deploy --only firestore
```

### 4. Create Initial Admin User

After logging in to your app for the first time, you need to manually set your user as an admin in Firestore:

1. Open Firebase Console: https://console.firebase.google.com/
2. Navigate to your project → Firestore Database
3. Find the `users` collection
4. Locate your user document (created after first login)
5. Edit the document and set `role` field to `ADMIN`

### 5. Start Development Server
```bash
npm run dev
```

The app will be available at http://localhost:3000 (or next available port).

## Firestore Collections Structure

The app uses these collections:
- `users` - User accounts and roles
- `families` - Family/member records
- `festivals` - Festival events
- `payments` - Payment records
- `expenses` - Expense tracking
- `receipts` - Payment receipts

All collections will be created automatically when you add data through the app.

## Troubleshooting

### "Failed to load dashboard data"
This usually means:
- Firestore rules haven't been deployed → Run `firebase deploy --only firestore`
- Collections are empty → Add some data through the app UI
- You're not logged in as admin → Update your user role in Firestore Console

### Permission Denied Errors
- Verify Firestore rules are deployed
- Check your user has `role: ADMIN` in the users collection
- Make sure you're logged in

### Firebase Not Initialized
- Verify `.env.local` has all required `NEXT_PUBLIC_FIREBASE_*` variables
- Restart the dev server after changing environment variables

## Initial Data Setup

Once logged in as admin, create data in this order:
1. **Families** → Go to Families page and add family records
2. **Festivals** → Create festival events  
3. **Payments** → Record payments from families for festivals
4. **Expenses** → Track festival-related expenses

The dashboard will populate automatically as you add data.
