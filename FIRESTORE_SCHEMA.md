# Firestore Database Schema

This document outlines the Firestore collections and document structure for the LBC application.

## Collections

### 1. users
Stores user authentication and profile information.

**Document ID**: Firebase Auth UID

**Fields**:
```typescript
{
  email: string;           // User email address
  name: string;            // Full name
  role: 'ADMIN' | 'USER';  // User role
  phone?: string;          // Optional phone number
  photoURL?: string;       // Optional profile photo
  createdAt: Timestamp;    // Account creation date
  updatedAt: Timestamp;    // Last update date
}
```

**Indexes**:
- `role` (Ascending)
- `email` (Ascending)

---

### 2. families
Stores village family information.

**Document ID**: Auto-generated

**Fields**:
```typescript
{
  headName: string;        // Head of family name
  members: number;         // Number of family members
  phone: string;           // Contact phone number
  address: string;         // Family address
  isActive: boolean;       // Whether family is active
  createdAt: Timestamp;    // Creation date
  updatedAt: Timestamp;    // Last update date
}
```

**Indexes**:
- `isActive` (Ascending)
- `headName` (Ascending)

---

### 3. festivals
Stores festival information and Chanda amounts.

**Document ID**: Auto-generated

**Fields**:
```typescript
{
  name: string;            // Festival name
  type: string;            // Festival type (DURGA_PUJA, DIWALI, etc.)
  date: Timestamp;         // Festival date
  amountPerFamily: number; // Chanda amount per family
  description?: string;    // Optional description
  isActive: boolean;       // Whether festival is active
  createdAt: Timestamp;    // Creation date
  updatedAt: Timestamp;    // Last update date
}
```

**Indexes**:
- `date` (Ascending)
- `isActive` (Ascending)
- `type` (Ascending)

---

### 4. payments
Stores payment transactions.

**Document ID**: Auto-generated

**Fields**:
```typescript
{
  familyId: string;        // Reference to family document
  festivalId: string;      // Reference to festival document
  amount: number;          // Payment amount
  paidDate: Timestamp;     // Payment date
  status: string;          // PAID, UNPAID, or PENDING
  receiptNumber?: string;  // Receipt number
  notes?: string;          // Optional notes
  createdAt: Timestamp;    // Creation date
  updatedAt: Timestamp;    // Last update date
}
```

**Indexes**:
- `familyId` (Ascending), `festivalId` (Ascending)
- `festivalId` (Ascending), `status` (Ascending)
- `paidDate` (Descending)

---

### 5. receipts
Stores receipt metadata.

**Document ID**: Auto-generated

**Fields**:
```typescript
{
  paymentId: string;       // Reference to payment document
  receiptNumber: string;   // Unique receipt number
  familyName: string;      // Family name (denormalized)
  festivalName: string;    // Festival name (denormalized)
  amount: number;          // Payment amount (denormalized)
  paidDate: Timestamp;     // Payment date (denormalized)
  generatedBy: string;     // User ID who generated receipt
  pdfUrl?: string;         // Optional PDF storage URL
  createdAt: Timestamp;    // Creation date
  updatedAt: Timestamp;    // Last update date
}
```

**Indexes**:
- `paymentId` (Ascending)
- `receiptNumber` (Ascending)

---

## Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Helper functions
    function isAuthenticated() {
      return request.auth != null;
    }
    
    function isAdmin() {
      return isAuthenticated() && 
             get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'ADMIN';
    }
    
    // Users collection
    match /users/{userId} {
      allow read: if isAuthenticated();
      allow create: if isAuthenticated();
      allow update: if isAdmin() || request.auth.uid == userId;
      allow delete: if isAdmin();
    }
    
    // Families collection
    match /families/{familyId} {
      allow read: if isAuthenticated();
      allow create, update, delete: if isAdmin();
    }
    
    // Festivals collection
    match /festivals/{festivalId} {
      allow read: if isAuthenticated();
      allow create, update, delete: if isAdmin();
    }
    
    // Payments collection
    match /payments/{paymentId} {
      allow read: if isAuthenticated();
      allow create, update, delete: if isAdmin();
    }
    
    // Receipts collection
    match /receipts/{receiptId} {
      allow read: if isAuthenticated();
      allow create: if isAdmin();
      allow update, delete: if isAdmin();
    }
  }
}
```

---

## Sample Data

### Sample User (Admin)
```javascript
{
  email: "admin@lbc.com",
  name: "Admin User",
  role: "ADMIN",
  phone: "+919876543210",
  createdAt: Timestamp.now(),
  updatedAt: Timestamp.now()
}
```

### Sample Family
```javascript
{
  headName: "Ramesh Kumar",
  members: 5,
  phone: "+919876543210",
  address: "Village Road, Near Temple",
  isActive: true,
  createdAt: Timestamp.now(),
  updatedAt: Timestamp.now()
}
```

### Sample Festival
```javascript
{
  name: "Durga Puja 2026",
  type: "DURGA_PUJA",
  date: Timestamp.fromDate(new Date('2026-10-15')),
  amountPerFamily: 500,
  description: "Annual Durga Puja celebration",
  isActive: true,
  createdAt: Timestamp.now(),
  updatedAt: Timestamp.now()
}
```

### Sample Payment
```javascript
{
  familyId: "family-doc-id",
  festivalId: "festival-doc-id",
  amount: 500,
  paidDate: Timestamp.now(),
  status: "PAID",
  receiptNumber: "LBC1707654321123",
  notes: "Paid in cash",
  createdAt: Timestamp.now(),
  updatedAt: Timestamp.now()
}
```
