# LBC Developer Quick Reference

## 🚀 Quick Commands

```bash
# Install dependencies
npm install

# Development
npm run dev                    # Start dev server (http://localhost:3000)

# Build
npm run build:dev             # Build for development
npm run build:staging         # Build for staging
npm run build:prod            # Build for production

# Production
npm start                     # Start production server

# Linting
npm run lint                  # Run ESLint
```

## 📂 File Structure Quick Reference

```
src/
├── app/                      → Next.js pages
│   ├── (dashboard)/         → Protected routes
│   └── auth/                → Auth pages
├── core/                     → Shared modules
│   ├── ui/                  → Button, Card, Input, Loader
│   ├── types/               → TypeScript interfaces
│   └── constants/           → App constants
├── features/                 → Feature modules
│   ├── {feature}/
│   │   ├── data/            → Repositories
│   │   ├── domain/          → Use cases
│   │   ├── presentation/    → Components
│   │   └── di/              → DI container
└── utils/                    → Utilities
```

## 🔥 Firebase Collections

| Collection | Purpose |
|------------|---------|
| `users` | User profiles and roles |
| `families` | Village families |
| `festivals` | Festival information |
| `payments` | Payment transactions |
| `receipts` | Receipt metadata |

## 🎯 User Roles

- **ADMIN**: Full access (CRUD all resources)
- **USER**: Read-only access

## 🛣 Route Reference

### Public Routes
- `/` - Home (redirects to login)
- `/auth/login` - Login page
- `/auth/register` - Registration page

### Protected Routes (Require Auth)
- `/dashboard` - Dashboard overview
- `/families` - Family list
- `/families/create` - Add family (Admin only)
- `/festivals` - Festival list
- `/festivals/create` - Add festival (Admin only)
- `/payments` - Payment management (Admin only)
- `/calendar` - Festival calendar
- `/reports` - Reports (Admin only)
- `/settings` - Settings

## 📦 Key Dependencies

```json
{
  "next": "^14.2.0",
  "react": "^18.3.1",
  "firebase": "^10.12.0",
  "typescript": "^5.4.5",
  "tailwindcss": "^3.4.3",
  "jspdf": "^2.5.1",
  "react-hook-form": "^7.51.0",
  "zod": "^3.23.0"
}
```

## 🎨 UI Components

### Button
```tsx
import { Button } from '@/core/ui';

<Button variant="primary" size="md" isLoading={false}>
  Click Me
</Button>
```

**Variants**: `primary`, `secondary`, `outline`, `ghost`, `danger`  
**Sizes**: `sm`, `md`, `lg`

### Card
```tsx
import { Card } from '@/core/ui';

<Card padding="md" shadow="md">
  Content here
</Card>
```

### Input
```tsx
import { Input } from '@/core/ui';

<Input
  label="Name"
  error="Error message"
  helperText="Helper text"
  required
/>
```

### Loader
```tsx
import { Loader } from '@/core/ui';

<Loader size="lg" />
```

**Sizes**: `sm`, `md`, `lg`

## 🔧 Utility Functions

### Date Formatting
```tsx
import { formatDate, formatDateTime } from '@/utils';

formatDate(new Date());       // "11/02/2026"
formatDateTime(new Date());   // "11/02/2026 10:30 am"
```

### Currency Formatting
```tsx
import { formatCurrency } from '@/utils';

formatCurrency(500);          // "₹500"
formatCurrency(1000);         // "₹1,000"
```

### Validation
```tsx
import { isValidPhone, isValidEmail } from '@/utils';

isValidPhone("9876543210");   // true
isValidEmail("user@lbc.com"); // true
```

## 🧩 Creating a New Feature

### 1. Create Feature Structure
```
src/features/myfeature/
├── data/
│   └── repositories/
│       └── firebase-myfeature.repository.ts
├── domain/
│   ├── repositories/
│   │   └── myfeature.repository.interface.ts
│   └── usecases/
│       └── get-myfeature.usecase.ts
├── presentation/
│   └── components/
│       └── MyFeatureList.tsx
└── di/
    └── myfeature.container.ts
```

### 2. Define Repository Interface (domain/)
```typescript
export interface IMyFeatureRepository {
  getById(id: string): Promise<MyFeature | null>;
  getAll(): Promise<MyFeature[]>;
}
```

### 3. Create Use Case (domain/)
```typescript
export class GetMyFeatureUseCase implements IUseCase<void, MyFeature[]> {
  constructor(private repo: IMyFeatureRepository) {}
  
  async execute(): Promise<MyFeature[]> {
    return await this.repo.getAll();
  }
}
```

### 4. Implement Repository (data/)
```typescript
export class FirebaseMyFeatureRepository 
  extends BaseFirestoreRepository<MyFeature>
  implements IMyFeatureRepository {
  
  constructor() {
    super('myfeatures');
  }
  
  protected toEntity(doc: DocumentData): MyFeature {
    return {
      id: doc.id,
      // map fields
    };
  }
}
```

### 5. Setup DI Container (di/)
```typescript
class MyFeatureContainer {
  private _repo: FirebaseMyFeatureRepository | null = null;
  
  repository() {
    if (!this._repo) {
      this._repo = new FirebaseMyFeatureRepository();
    }
    return this._repo;
  }
  
  getMyFeatureUseCase() {
    return new GetMyFeatureUseCase(this.repository());
  }
}

export const myFeatureContainer = new MyFeatureContainer();
```

### 6. Create Component (presentation/)
```tsx
export const MyFeatureList: React.FC = () => {
  const [data, setData] = useState([]);
  const getUseCase = myFeatureContainer.getMyFeatureUseCase();
  
  useEffect(() => {
    getUseCase.execute().then(setData);
  }, []);
  
  return <div>{/* Render data */}</div>;
};
```

## 🔐 Auth Context Usage

```tsx
import { useAuth } from '@/features/auth/presentation/context/AuthContext';

const MyComponent = () => {
  const { user, loading, isAdmin, login, logout } = useAuth();
  
  if (loading) return <Loader />;
  if (!user) return <Login />;
  
  return <div>Welcome {user.name}</div>;
};
```

## 🗂 Type Definitions

### Family
```typescript
interface Family {
  id: string;
  headName: string;
  members: number;
  phone: string;
  address: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

### Festival
```typescript
interface Festival {
  id: string;
  name: string;
  type: string;
  date: Date;
  amountPerFamily: number;
  description?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

### Payment
```typescript
interface Payment {
  id: string;
  familyId: string;
  festivalId: string;
  amount: number;
  paidDate: Date;
  status: 'PAID' | 'UNPAID' | 'PENDING';
  receiptNumber?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

## ⚠️ Common Issues

### Firebase Not Initialized
**Solution**: Ensure `.env` file has correct Firebase credentials

### User Role Not Working
**Solution**: Check Firestore `users` collection, ensure `role: "ADMIN"`

### Build Errors
**Solution**: 
```bash
rm -rf .next node_modules
npm install
npm run dev
```

### Type Errors
**Solution**: Check imports use `@/` path alias

## 📝 Code Style

### Import Order
```typescript
// 1. External libraries
import React from 'react';
import { useRouter } from 'next/navigation';

// 2. Core imports
import { Button } from '@/core/ui';
import { APP_ROUTES } from '@/core/routes';

// 3. Feature imports
import { useAuth } from '@/features/auth/presentation/context/AuthContext';

// 4. Utils
import { formatDate } from '@/utils';
```

### Naming Conventions
- **Components**: PascalCase (`MyComponent.tsx`)
- **Files**: kebab-case (`my-file.ts`)
- **Interfaces**: PascalCase with `I` prefix (`IRepository`)
- **Use Cases**: PascalCase with `UseCase` suffix
- **Repositories**: PascalCase with `Repository` suffix

## 🧪 Testing (Future)

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Coverage
npm run test:coverage
```

## 📚 Additional Resources

- [Next.js Docs](https://nextjs.org/docs)
- [Firebase Docs](https://firebase.google.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

**Pro Tips**:
- Use `CTRL + P` in VS Code to quickly find files
- Use `CTRL + Shift + F` to search across all files
- Install "ES7+ React/Redux/React-Native snippets" extension
- Install "Tailwind CSS IntelliSense" extension

**Last Updated**: February 11, 2026
