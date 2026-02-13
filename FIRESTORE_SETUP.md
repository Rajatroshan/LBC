# Firestore Setup Instructions

## Overview
Your app is now running but needs Firestore database collections and security rules configured.

## Step 1: Configure Firestore Security Rules

1. Go to [Firebase Console](https://console.firebase.google.com/project/lbc-chanda-management/firestore)
2. Click on **Firestore Database** in the left sidebar
3. Click **Rules** tab
4. Replace the rules with this configuration:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Helper function to check if user is authenticated
    function isAuthenticated() {
      return request.auth != null;
    }
    
    // Helper function to check if user is admin
    function isAdmin() {
      return isAuthenticated() && 
             get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'ADMIN';
    }
    
    // Users collection - users can read their own data, admins can do anything
    match /users/{userId} {
      allow read: if isAuthenticated() && (request.auth.uid == userId || isAdmin());
      allow write: if isAdmin();
    }
    
    // Families collection - authenticated users can read, admins can write
    match /families/{familyId} {
      allow read: if isAuthenticated();
      allow write: if isAdmin();
    }
    
    // Festivals collection - authenticated users can read, admins can write
    match /festivals/{festivalId} {
      allow read: if isAuthenticated();
      allow write: if isAdmin();
    }
    
    // Payments collection - authenticated users can read, admins can write
    match /payments/{paymentId} {
      allow read: if isAuthenticated();
      allow write: if isAdmin();
    }
    
    // Expenses collection - authenticated users can read, admins can write
    match /expenses/{expenseId} {
      allow read: if isAuthenticated();
      allow write: if isAdmin();
    }
  }
}
```

5. Click **Publish**

## Step 2: Create Admin User

Since your user (`rajatkumarsahu964@gmail.com`) is already registered, you need to make them an admin:

1. Go to **Firestore Database** > **Data** tab
2. Find the `users` collection
3. Find your user document
4. Edit the document and set `role` field to `"ADMIN"`

If the user doesn't exist yet:
1. Click **+ Start collection**
2. Collection ID: `users`
3. Click **Next**
4. Add a document with your user ID:
   - Document ID: (your Firebase Auth UID - check in Authentication tab)
   - Fields:
     ```
     email: "rajatkumarsahu964@gmail.com"
     name: "Rajat Kumar Sahu"
     role: "ADMIN"
     createdAt: (timestamp)
     updatedAt: (timestamp)
     ```

## Step 3: Test the App

1. Refresh your browser at http://localhost:3001
2. The errors should be gone - you'll see empty states instead:
   - "No families found"
   - "No festivals available"
   - "No payments recorded yet"
3. Start adding data using the "Create" buttons! ✅

## Collections Structure

Your app uses these Firestore collections:

### families
- `headName` (string): Family head name
- `members` (array): Family members
- `phone` (string): Contact number
- `address` (string): Address
- `isActive` (boolean): Active status
- `createdAt` (timestamp)
- `updatedAt` (timestamp)

### festivals
- `name` (string): Festival name
- `date` (timestamp): Festival date
- `type` (string): Festival type
- `amountPerFamily` (number): Amount per family
- `description` (string): Description
- `isActive` (boolean): Active status
- `createdAt` (timestamp)
- `updatedAt` (timestamp)

### payments
- `familyId` (string): Reference to family
- `festivalId` (string): Reference to festival
- `amount` (number): Payment amount
- `paidDate` (timestamp): Payment date
- `status` (string): PAID | UNPAID | PENDING
- `notes` (string): Optional notes
- `createdAt` (timestamp)
- `updatedAt` (timestamp)

### expenses
- `festivalId` (string): Reference to festival
- `amount` (number): Expense amount
- `category` (string): TENT | FOOD | DECORATION | ENTERTAINMENT | UTILITIES | OTHER
- `purpose` (string): Purpose description
- `paidTo` (string): Vendor/recipient name
- `paidDate` (timestamp): Payment date
- `notes` (string): Optional notes
- `createdAt` (timestamp)
- `updatedAt` (timestamp)

### users
- `email` (string): User email
- `name` (string): User name
- `role` (string): ADMIN | USER
- `createdAt` (timestamp)
- `updatedAt` (timestamp)

## Troubleshooting

### Still seeing errors?
1. Check browser console (F12) for specific Firebase errors
2. Verify your .env.local file has correct Firebase credentials
3. Ensure Firestore Database is created (not Realtime Database)
4. Check that security rules are published

### Permission denied errors?
1. Make sure you're logged in
2. Verify your user has `role: "ADMIN"` in Firestore
3. Check security rules are correctly configured

### Empty collections OK?
Yes! Empty collections will show helpful empty states like:
- "No families found. Click 'Add Family' to get started."
- This is normal for a new installation

## Next Steps

1. **Add Families**: Go to Families → Add Family
2. **Create Festivals**: Go to Festivals → Create Festival
3. **Record Payments**: Go to Payments → Record Payment
4. **Track Expenses**: Go to Payments → Expenses tab → Record Expense
5. **View Reports**: Go to Reports to see financial summaries

Your LBC Chanda Management System is ready to use! 🎉
