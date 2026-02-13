# LBC - Luhuren Bae Club

Village Chanda (contribution) Management System for managing family contributions during festivals.

## Project Structure

```
LBC-next/
├── frontend/          # Next.js 14 App (React + TypeScript)
│   ├── src/
│   │   ├── app/           # Next.js App Router pages
│   │   ├── components/    # React UI components
│   │   ├── contexts/      # React contexts (Auth)
│   │   ├── controllers/   # Business logic controllers
│   │   ├── services/      # Firebase client SDK services
│   │   ├── models/        # Type re-exports from shared
│   │   ├── lib/           # Firebase client initialization
│   │   ├── core/          # Config, providers, routes, errors
│   │   ├── environments/  # Dev/staging/prod configs
│   │   ├── hooks/         # Custom React hooks
│   │   ├── utils/         # Utility functions
│   │   └── theme/         # Theme configuration
│   ├── package.json
│   ├── tsconfig.json
│   ├── next.config.js
│   └── tailwind.config.ts
│
├── backend/           # Firebase Cloud Functions (Express.js)
│   ├── src/
│   │   ├── controllers/   # API request handlers
│   │   ├── repositories/  # Firestore data access (Admin SDK)
│   │   ├── routes/        # Express route definitions
│   │   ├── middlewares/   # Auth middleware
│   │   ├── config/        # Firebase Admin config
│   │   └── index.ts       # Entry point
│   ├── package.json
│   └── tsconfig.json
│
├── shared/            # Shared between frontend & backend
│   ├── models/        # TypeScript interfaces
│   └── constants/     # Enums & constants
│
├── firebase.json      # Firebase hosting/functions config
└── package.json       # Root workspace scripts
```

## Quick Start

### Prerequisites
- Node.js 18+
- Firebase CLI (`npm install -g firebase-tools`)

### Setup

```bash
# Install all dependencies
npm run install:all

# Set up environment variables
cp frontend/.env.example frontend/.env.local
# Edit frontend/.env.local with your Firebase config

# Start frontend dev server
npm run dev

# Start backend emulator (separate terminal)
npm run backend:serve
```

## Architecture

**Frontend (MVC Pattern)**
- **Controllers** — Business logic, validation, orchestration
- **Services** — Firebase Client SDK operations (Firestore, Auth)
- **Components** — React UI components
- **Contexts** — React state management (AuthContext)

**Backend (MVC Pattern)**
- **Controllers** — API request handling, validation
- **Repositories** — Firebase Admin SDK data access
- **Routes** — Express.js route definitions

**Shared**
- **Models** — TypeScript interfaces used by both frontend & backend
- **Constants** — Enums, collection names, validation rules

## Tech Stack

- **Frontend:** Next.js 14, React 18, TypeScript, Tailwind CSS
- **Backend:** Express.js on Firebase Functions
- **Database:** Cloud Firestore
- **Auth:** Firebase Authentication
- **Storage:** Firebase Storage
