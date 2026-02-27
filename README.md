# LBC - Luhuren Bae Club

Village Chanda (contribution) Management System for managing family contributions during festivals.

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **UI:** React 18, TypeScript, Tailwind CSS
- **Database:** Cloud Firestore
- **Auth:** Firebase Authentication
- **PDF Generation:** jsPDF
- **Form Management:** React Hook Form + Zod
- **Animations:** Framer Motion
- **Icons:** Lucide React

## Project Structure

```
LBC-next/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (landing)/          # Landing page components
│   │   ├── (dashboard)/        # Dashboard layout & pages
│   │   ├── auth/               # Login & register pages
│   │   ├── layout.tsx          # Root layout
│   │   └── page.tsx            # Landing page
│   │
│   ├── components/             # React components
│   │   ├── auth/               # Login/Register forms
│   │   ├── dashboard/          # Dashboard view
│   │   ├── expenses/           # Expense management
│   │   ├── family/             # Family management
│   │   ├── festival/           # Festival management
│   │   ├── payments/           # Payment management
│   │   ├── reports/            # Report generation
│   │   └── ui/                 # Reusable UI components
│   │
│   ├── controllers/            # Business logic layer
│   │   ├── auth.controller.ts
│   │   ├── dashboard.controller.ts
│   │   ├── expense.controller.ts
│   │   ├── family.controller.ts
│   │   ├── festival.controller.ts
│   │   └── payment.controller.ts
│   │
│   ├── services/               # Firebase service layer
│   │   ├── auth.service.ts
│   │   ├── expense.service.ts
│   │   ├── family.service.ts
│   │   ├── festival.service.ts
│   │   └── payment.service.ts
│   │
│   ├── contexts/               # React contexts
│   │   └── AuthContext.tsx    # Authentication state
│   │
│   ├── core/                   # Core infrastructure
│   │   ├── config/             # Environment configuration
│   │   ├── providers/          # Firebase provider
│   │   └── routes/             # Route constants
│   │
│   ├── environments/           # Environment configs
│   │   ├── env.dev.ts
│   │   ├── env.staging.ts
│   │   └── env.prod.ts
│   │
│   ├── models/                 # TypeScript interfaces
│   ├── constants/              # App constants & enums
│   ├── utils/                  # Utility functions
│   └── lib/                    # Firebase initialization
│
├── firebase.json               # Firebase configuration
├── firestore.rules             # Firestore security rules
├── firestore.indexes.json      # Firestore indexes
└── package.json
```

## Quick Start

### Prerequisites
- Node.js 18+
- Firebase project
- Firebase CLI: `npm install -g firebase-tools`

### Installation

1. **Install dependencies**
```bash
npm install
```

2. **Configure environment variables**

Create `.env.local` file with your Firebase config:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-auth-domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-storage-bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
NEXT_PUBLIC_ENV=dev
```

3. **Deploy Firestore rules & indexes**
```bash
firebase login
firebase deploy --only firestore
```

4. **Start development server**
```bash
npm run dev
```

Visit http://localhost:3000

### First-time Setup

1. Register a user through the UI
2. Go to [Firebase Console](https://console.firebase.google.com/) → Firestore
3. Find your user in the `users` collection
4. Set `role` field to `"ADMIN"`
5. Refresh the app - you'll now have admin access

## Architecture

### MVC Pattern
- **Models** (`/models`) - TypeScript interfaces & types
- **Views** (`/app`, `/components`) - React UI components
- **Controllers** (`/controllers`) - Business logic orchestration

### Service Layer
Controllers use services for Firebase operations:
- **Services** (`/services`) - Firebase Client SDK calls (Firestore, Auth)
- Clean separation between business logic and data access

### Authentication Flow
1. User logs in via `LoginForm` → `authController`
2. Controller calls `authService` → Firebase Auth
3. `AuthContext` manages global auth state
4. Protected routes check auth in layout components

## Key Features

- ✅ User authentication & role-based access (Admin/User)
- ✅ Family member management
- ✅ Festival event tracking
- ✅ Payment collection & status tracking
- ✅ Expense recording & categorization
- ✅ Dashboard with real-time statistics
- ✅ PDF report generation
- ✅ Responsive design with Tailwind CSS
- ✅ Form validation with React Hook Form + Zod
- ✅ Offline persistence with Firestore

## Firestore Collections

See [FIRESTORE_SCHEMA.md](./FIRESTORE_SCHEMA.md) for detailed schema documentation.

- `users` - User profiles & roles
- `families` - Family records
- `festivals` - Festival events
- `payments` - Payment transactions
- `expenses` - Expense records

## Build Commands

```bash
# Development
npm run dev

# Production builds
npm run build              # Default (dev)
npm run build:dev          # Development build
npm run build:staging      # Staging build
npm run build:prod         # Production build

# Start production server
npm start
```

## Troubleshooting

See [SETUP_INSTRUCTIONS.md](./SETUP_INSTRUCTIONS.md) for detailed troubleshooting guide.

## License

Private - All rights reserved
