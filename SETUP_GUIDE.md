# LBC Setup Guide

Complete setup guide for the LBC (Luhuren Bae Club) Village Chanda Management System.

## Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Firebase account
- Git (optional)

## Step 1: Install Dependencies

```bash
cd d:\LBC-next
npm install
```

## Step 2: Firebase Setup

### 2.1 Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add Project"
3. Enter project name (e.g., "lbc-chanda-management")
4. Enable Google Analytics (optional)
5. Create project

### 2.2 Enable Authentication

1. In Firebase Console, go to **Authentication**
2. Click "Get Started"
3. Enable **Email/Password** sign-in method
4. Save

### 2.3 Create Firestore Database

1. In Firebase Console, go to **Firestore Database**
2. Click "Create Database"
3. Start in **Production Mode**
4. Choose a location nearest to you
5. Create database

### 2.4 Set Firestore Security Rules

Go to **Firestore Database > Rules** and paste:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function isAuthenticated() {
      return request.auth != null;
    }
    
    function isAdmin() {
      return isAuthenticated() && 
             get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'ADMIN';
    }
    
    match /users/{userId} {
      allow read: if isAuthenticated();
      allow create: if isAuthenticated();
      allow update: if isAdmin() || request.auth.uid == userId;
      allow delete: if isAdmin();
    }
    
    match /families/{familyId} {
      allow read: if isAuthenticated();
      allow create, update, delete: if isAdmin();
    }
    
    match /festivals/{festivalId} {
      allow read: if isAuthenticated();
      allow create, update, delete: if isAdmin();
    }
    
    match /payments/{paymentId} {
      allow read: if isAuthenticated();
      allow create, update, delete: if isAdmin();
    }
    
    match /receipts/{receiptId} {
      allow read: if isAuthenticated();
      allow create: if isAdmin();
      allow update, delete: if isAdmin();
    }
  }
}
```

Click **Publish**.

### 2.5 Get Firebase Configuration

1. In Firebase Console, go to **Project Settings** (gear icon)
2. Scroll down to "Your apps"
3. Click "Web" icon (`</>`)
4. Register app with nickname "LBC Web"
5. Copy the Firebase config object

## Step 3: Environment Configuration

1. Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

2. Edit `.env` and add your Firebase credentials:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain_here
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id_here
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket_here
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id_here
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id_here
NEXT_PUBLIC_ENV=dev
```

## Step 4: Create First Admin User

### Method 1: Register and Manually Update (Recommended)

1. Start the development server:
```bash
npm run dev
```

2. Open http://localhost:3000
3. Click "Register" and create an account
4. Go to Firebase Console > Firestore Database
5. Find the `users` collection
6. Open your user document
7. Change `role` field from `"USER"` to `"ADMIN"`
8. Save

### Method 2: Create Directly in Firestore

1. Go to Firebase Console > Firestore Database
2. Click "Start Collection"
3. Collection ID: `users`
4. Document ID: (will be your auth UID after account creation)
5. Create an authentication account first, then add document with fields:
   - `email`: your email
   - `name`: your name
   - `role`: "ADMIN"
   - `createdAt`: timestamp
   - `updatedAt`: timestamp

## Step 5: Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Step 6: Build for Production

### Development Build
```bash
npm run build:dev
```

### Staging Build
```bash
npm run build:staging
```

### Production Build
```bash
npm run build:prod
```

### Start Production Server
```bash
npm start
```

## Project Structure Overview

```
src/
├── app/                    # Next.js App Router pages
│   ├── (dashboard)/       # Protected dashboard routes
│   └── auth/              # Authentication pages
├── core/                  # Core shared modules
│   ├── config/            # Configuration
│   ├── constants/         # App constants
│   ├── error/             # Error handling
│   ├── network/           # Firebase setup
│   ├── routes/            # Route definitions
│   ├── shared/            # Shared interfaces
│   ├── types/             # TypeScript types
│   └── ui/                # Shared UI components
├── features/              # Feature modules
│   ├── auth/              # Authentication
│   ├── family/            # Family management
│   ├── festival/          # Festival management
│   ├── payments/          # Payment tracking
│   ├── dashboard/         # Dashboard
│   └── receipts/          # Receipt generation
├── theme/                 # Theme configuration
├── utils/                 # Utility functions
└── environments/          # Environment configs
```

## Common Tasks

### Add a New Family (Admin)
1. Login as admin
2. Navigate to Families
3. Click "Add Family"
4. Fill in details and submit

### Create a Festival (Admin)
1. Navigate to Festivals
2. Click "Add Festival"
3. Enter festival details and Chanda amount
4. Submit

### Record a Payment (Admin)
1. Navigate to Payments
2. Select festival and family
3. Enter payment details
4. Generate receipt

### View Dashboard
- Login to see overview of collections, families, and festivals
- View recent payments and upcoming festivals

## Troubleshooting

### Firebase Connection Issues
- Verify `.env` file has correct Firebase credentials
- Check Firebase project is active
- Ensure Firestore is created

### Authentication Errors
- Verify Email/Password authentication is enabled
- Check Firestore security rules are published
- Ensure user document exists in Firestore

### Build Errors
- Run `npm install` to ensure all dependencies are installed
- Clear `.next` folder and rebuild
- Check Node.js version (18+)

### Can't Access Admin Features
- Verify user role is "ADMIN" in Firestore
- Logout and login again
- Clear browser cache

## Deployment

### Vercel (Recommended)

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
vercel
```

3. Set environment variables in Vercel dashboard

### Other Platforms
- Configure environment variables
- Set build command: `npm run build:prod`
- Set start command: `npm start`
- Ensure Node.js 18+ is available

## Support

For issues or questions:
- Check `FIRESTORE_SCHEMA.md` for database structure
- Review feature module documentation
- Check Firebase Console for errors

## Next Steps

1. ✅ Complete Firebase setup
2. ✅ Create admin user
3. ✅ Add sample families
4. ✅ Create festivals
5. ✅ Test payment workflow
6. ✅ Generate receipts
7. ✅ Deploy to production

---

**Version**: 1.0.0  
**Last Updated**: February 11, 2026
