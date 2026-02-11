# LBC (Luhuren Bae Club) - Village Chanda Management System

A modern Next.js application for managing festival-wise village family contributions.

## 🌟 Features

- **Role-Based Access Control**: Admin and User roles with specific permissions
- **Festival Management**: Create and manage village festivals
- **Family Management**: CRUD operations for village families
- **Payment Tracking**: Track Chanda payments per festival
- **Receipt Generation**: Digital PDF receipts
- **Reports**: Festival-wise collection reports
- **Calendar**: Festival date calendar
- **Dashboard**: Overview of collections and pending families

## 🏗 Architecture

This project follows **Clean Architecture** principles with:
- Feature-based folder structure
- Separation of concerns (Data, Domain, Presentation)
- Dependency Injection
- Centralized core modules

## 📦 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Authentication**: Firebase Authentication
- **Database**: Firebase Firestore
- **Styling**: Tailwind CSS
- **PDF Generation**: jsPDF
- **Forms**: React Hook Form + Zod

## 🚀 Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment:**
   ```bash
   cp .env.example .env
   # Add your Firebase credentials
   ```

3. **Run development server:**
   ```bash
   npm run dev
   ```

4. **Open browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📂 Project Structure

```
src/
├── core/              # Shared core modules
├── features/          # Feature modules (auth, family, festival, etc.)
├── theme/             # Theme configuration
├── utils/             # Utility functions
├── app/               # Next.js App Router pages
└── environments/      # Environment configs
```

## 🔐 Default Admin Credentials

Create admin user through Firebase Console or registration flow.

## 📱 Roles

### Admin
- Manage families and festivals
- Set Chanda amounts
- Mark payments
- Generate receipts
- View reports

### User
- View festivals
- View payment history
- View festival calendar
- View collection summaries

## 🛠 Build

```bash
# Development
npm run build:dev

# Staging
npm run build:staging

# Production
npm run build:prod
```

## 📄 License

MIT
#
