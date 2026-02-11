# LBC - Luhuren Bae Club
## Village Chanda Management System

## 📋 Table of Contents
- [Features](#features)
- [Architecture](#architecture)
- [Quick Start](#quick-start)
- [Documentation](#documentation)
- [Tech Stack](#tech-stack)

## ✨ Features

### 👨‍💼 Admin Features
- ✅ Complete family management (CRUD operations)
- ✅ Festival creation and management
- ✅ Set Chanda amount per festival
- ✅ Payment tracking (Mark as Paid/Unpaid)
- ✅ Generate PDF receipts
- ✅ View collection reports
- ✅ Dashboard with real-time stats

### 👤 User Features
- ✅ View festival calendar
- ✅ Check payment history
- ✅ View all families
- ✅ See collection summaries

## 🏗 Architecture

This project follows **Clean Architecture** principles:

```
📁 src/
├── 📁 app/              # Next.js App Router (Pages)
├── 📁 core/             # Core shared modules
│   ├── config/          # Environment configs
│   ├── constants/       # App constants
│   ├── error/           # Error handling
│   ├── network/         # Firebase setup
│   ├── routes/          # Route definitions
│   ├── shared/          # Base classes
│   ├── types/           # TypeScript types
│   └── ui/              # Shared UI components
├── 📁 features/         # Feature modules
│   ├── auth/            # Authentication
│   ├── family/          # Family management
│   ├── festival/        # Festival management
│   ├── payments/        # Payment tracking
│   ├── receipts/        # Receipt generation
│   └── dashboard/       # Dashboard
├── 📁 theme/            # Theme configuration
├── 📁 utils/            # Utility functions
└── 📁 environments/     # Env configs (dev/staging/prod)
```

### Feature Module Structure
Each feature follows this clean architecture pattern:

```
feature/
├── data/                # Data layer
│   └── repositories/    # Firebase implementations
├── domain/              # Domain layer (Business logic)
│   ├── repositories/    # Repository interfaces
│   └── usecases/        # Use cases
├── presentation/        # Presentation layer
│   └── components/      # React components
└── di/                  # Dependency injection
    └── container.ts
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Firebase account

### Installation

1. **Clone and Install**
```bash
cd d:\LBC-next
npm install
```

2. **Setup Firebase**
- Create Firebase project
- Enable Authentication (Email/Password)
- Create Firestore database
- Get Firebase config

3. **Configure Environment**
```bash
cp .env.example .env
# Add your Firebase credentials to .env
```

4. **Run Development Server**
```bash
npm run dev
```

5. **Create Admin User**
- Register at http://localhost:3000
- Go to Firebase Console → Firestore
- Change user role to "ADMIN"

## 📚 Documentation

- **[SETUP_GUIDE.md](SETUP_GUIDE.md)** - Complete setup instructions
- **[ARCHITECTURE.md](ARCHITECTURE.md)** - Architecture deep dive
- **[FIRESTORE_SCHEMA.md](FIRESTORE_SCHEMA.md)** - Database schema

## 🛠 Tech Stack

### Frontend
- **Next.js 14** - React framework (App Router)
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **React Hook Form** - Form management
- **Zod** - Validation

### Backend
- **Firebase Authentication** - User auth
- **Firestore** - NoSQL database
- **Firebase Storage** - File storage

### PDF Generation
- **jsPDF** - PDF creation
- **jspdf-autotable** - PDF tables

### Architecture
- **Clean Architecture** - Layered design
- **Dependency Injection** - Loose coupling
- **Repository Pattern** - Data abstraction

## 📁 Project Structure Overview

### Core Modules
- **config/** - Environment-based configuration
- **constants/** - App-wide constants (roles, collections)
- **error/** - Custom error classes
- **network/** - Firebase initialization
- **routes/** - Centralized route definitions
- **types/** - TypeScript interfaces
- **ui/** - Reusable components (Button, Input, Card)

### Features
Each feature is self-contained with:
- Domain logic (use cases)
- Data access (repositories)
- UI components
- Dependency injection

## 🎨 UI Design

Modern, clean interface with:
- 🟢 Green health-style theme
- 📱 Responsive design
- 🎴 Card-based layout
- 🔄 Smooth transitions
- 📊 Data visualization

## 🔒 Security

- Firebase Authentication
- Role-based access control (ADMIN/USER)
- Firestore security rules
- Protected routes
- Input validation

## 🧪 Key Features Implementation

### Family Management
- Create, read, update, delete families
- Track family members
- Contact information
- Active/inactive status

### Festival Management
- Multiple festival types
- Date-based organization
- Chanda amount per family
- Upcoming festival tracking

### Payment Tracking
- Record payments
- Payment status (Paid/Unpaid/Pending)
- Receipt generation
- Payment history

### Dashboard
- Total families count
- Active families
- Upcoming festivals
- Collection summaries
- Recent payments

## 📝 Environment Support

Three environments with separate configs:
- **Development** (`npm run build:dev`)
- **Staging** (`npm run build:staging`)
- **Production** (`npm run build:prod`)

## 🚢 Deployment

### Build Commands
```bash
npm run build:dev      # Development build
npm run build:staging  # Staging build
npm run build:prod     # Production build
npm start              # Start production server
```

### Recommended Platforms
- Vercel (easiest)
- Netlify
- Firebase Hosting
- Any Node.js hosting

## 📄 License

MIT

## 🤝 Contributing

This is a village management system. Contributions welcome!

## 📞 Support

For setup issues, refer to:
1. [SETUP_GUIDE.md](SETUP_GUIDE.md)
2. [ARCHITECTURE.md](ARCHITECTURE.md)
3. Firebase Console logs

---

**Built with ❤️ for the Luhuren Bae community**

Version: 1.0.0 | February 2026
