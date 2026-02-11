# LBC Project Architecture

## Clean Architecture Overview

This project follows Clean Architecture principles with clear separation of concerns:

```
┌─────────────────────────────────────────────────────────┐
│                    Presentation Layer                    │
│         (React Components, Hooks, Context)              │
├─────────────────────────────────────────────────────────┤
│                     Domain Layer                         │
│         (Use Cases, Entities, Interfaces)               │
├─────────────────────────────────────────────────────────┤
│                      Data Layer                          │
│    (Repository Implementations, Firebase, API)          │
└─────────────────────────────────────────────────────────┘
```

## Layer Responsibilities

### 1. Presentation Layer (`presentation/`)
- **Components**: UI components (React)
- **Hooks**: Custom React hooks
- **Context**: React Context for state management
- **Dependencies**: Can depend on Domain layer

### 2. Domain Layer (`domain/`)
- **Entities**: Business models
- **Use Cases**: Business logic
- **Repository Interfaces**: Contracts for data access
- **Dependencies**: NO dependencies on other layers (pure business logic)

### 3. Data Layer (`data/`)
- **Repository Implementations**: Actual data fetching
- **Data Sources**: Firebase, REST APIs, etc.
- **Dependencies**: Can depend on Domain layer interfaces

## Feature Module Structure

Each feature follows this structure:

```
feature/
├── data/
│   └── repositories/
│       └── firebase-{feature}.repository.ts
├── domain/
│   ├── repositories/
│   │   └── {feature}.repository.interface.ts
│   └── usecases/
│       ├── create-{feature}.usecase.ts
│       ├── get-{feature}.usecase.ts
│       ├── update-{feature}.usecase.ts
│       └── delete-{feature}.usecase.ts
├── presentation/
│   ├── components/
│   │   ├── {Feature}List.tsx
│   │   └── {Feature}Form.tsx
│   ├── context/ (optional)
│   │   └── {Feature}Context.tsx
│   └── hooks/ (optional)
│       └── use{Feature}.ts
└── di/
    └── {feature}.container.ts
```

## Dependency Injection

Each feature has a DI container (`di/{feature}.container.ts`) that:
- Creates and manages dependencies
- Wires up repositories and use cases
- Provides singleton instances

Example:
```typescript
class FamilyContainer {
  private _repository: FamilyRepository | null = null;

  repository(): FamilyRepository {
    if (!this._repository) {
      this._repository = new FirebaseFamilyRepository();
    }
    return this._repository;
  }

  createFamilyUseCase(): CreateFamilyUseCase {
    return new CreateFamilyUseCase(this.repository());
  }
}
```

## Data Flow

### Creating a Resource (e.g., Family)

```
Component (FamilyForm) 
    → Use Case (CreateFamilyUseCase) 
        → Repository Interface (IFamilyRepository) 
            → Repository Implementation (FirebaseFamilyRepository) 
                → Firebase/Firestore
```

### Reading Resources

```
Component (FamilyList) 
    → Use Case (GetFamiliesUseCase) 
        → Repository (FirebaseFamilyRepository) 
            → Firebase/Firestore 
                → Return entities 
                    → Display in UI
```

## Core Modules

### `core/config/`
Environment-based configuration management

### `core/constants/`
Application-wide constants (collections, roles, messages)

### `core/error/`
Custom error classes and error handling

### `core/network/`
Firebase initialization and network utilities

### `core/routes/`
Centralized route definitions

### `core/shared/`
Shared interfaces and base classes

### `core/types/`
TypeScript type definitions for all entities

### `core/ui/`
Reusable UI components

## Benefits of This Architecture

### 1. **Testability**
- Business logic (use cases) is independent
- Easy to mock repositories
- Unit test each layer separately

### 2. **Maintainability**
- Clear separation of concerns
- Easy to find and modify code
- Changes in one layer don't affect others

### 3. **Scalability**
- Easy to add new features
- Can swap data sources (Firebase → REST API)
- Multiple implementations possible

### 4. **Reusability**
- Use cases can be reused across features
- Shared components in `core/ui/`
- Common utilities in `utils/`

### 5. **Type Safety**
- TypeScript throughout
- Interfaces define contracts
- Compile-time error checking

## Key Principles

### Dependency Rule
> Dependencies point inward. Inner layers don't know about outer layers.

### Interface Segregation
> Repository interfaces in domain layer, implementations in data layer

### Single Responsibility
> Each use case does one thing well

### Dependency Inversion
> Depend on abstractions (interfaces), not concretions

## Example: Adding a New Feature

Let's add a "Reports" feature:

### 1. Define Domain Layer

**`domain/repositories/report.repository.interface.ts`**
```typescript
export interface IReportRepository {
  generateFestivalReport(festivalId: string): Promise<Report>;
}
```

**`domain/usecases/generate-festival-report.usecase.ts`**
```typescript
export class GenerateFestivalReportUseCase 
  implements IUseCase<string, Report> {
  constructor(private repo: IReportRepository) {}
  
  async execute(festivalId: string): Promise<Report> {
    return await this.repo.generateFestivalReport(festivalId);
  }
}
```

### 2. Implement Data Layer

**`data/repositories/report.repository.ts`**
```typescript
export class ReportRepository implements IReportRepository {
  async generateFestivalReport(festivalId: string): Promise<Report> {
    // Implementation
  }
}
```

### 3. Create Presentation Layer

**`presentation/components/ReportView.tsx`**
```typescript
export const ReportView: React.FC = () => {
  const generateReportUseCase = reportContainer.generateReportUseCase();
  // Component logic
}
```

### 4. Setup DI Container

**`di/report.container.ts`**
```typescript
class ReportContainer {
  private _repo: ReportRepository | null = null;
  
  repository() {
    if (!this._repo) {
      this._repo = new ReportRepository();
    }
    return this._repo;
  }
  
  generateReportUseCase() {
    return new GenerateFestivalReportUseCase(this.repository());
  }
}
```

## Best Practices

1. **Keep use cases small** - One responsibility per use case
2. **Use interfaces** - Always program to interfaces in domain layer
3. **Immutable entities** - Treat entities as immutable when possible
4. **Error handling** - Use custom error classes from `core/error/`
5. **Type everything** - No `any` types
6. **DI containers** - Always use DI containers, never `new` in components
7. **Async/await** - Use async/await for all async operations
8. **Validation** - Validate in use cases before repository calls

## Testing Strategy

### Unit Tests
- Test use cases with mocked repositories
- Test repository implementations with Firebase emulators
- Test utility functions

### Integration Tests
- Test complete flows (create → read → update → delete)
- Test with actual Firebase (staging environment)

### E2E Tests
- Test user workflows
- Test role-based access control

---

**Remember**: Clean Architecture is about organizing code for maintainability and testability. Follow the principles, but adapt to your team's needs.
