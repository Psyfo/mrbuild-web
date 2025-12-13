# Development Rules & Best Practices

> **Last Updated:** December 13, 2025  
> **Purpose:** Maintain consistency, quality, and maintainability across the MrBuild Web project

## Table of Contents

1. [Project Structure](#project-structure)
2. [TypeScript Guidelines](#typescript-guidelines)
3. [Component Development](#component-development)
4. [Styling & UI](#styling--ui)
5. [API & Data Handling](#api--data-handling)
6. [Authentication & Security](#authentication--security)
7. [Database Patterns](#database-patterns)
8. [File & Naming Conventions](#file--naming-conventions)
9. [Documentation](#documentation)
10. [Git Workflow](#git-workflow)
11. [Testing](#testing)
12. [Performance](#performance)

---

## Project Structure

### Folder Organization

```
src/
├── app/              # Next.js App Router pages
│   ├── (admin)/     # Admin routes (protected)
│   ├── (auth)/      # Auth routes (public/redirect)
│   ├── (public)/    # Public-facing routes
│   └── api/         # API routes
├── components/       # Reusable components
│   ├── admin/       # Admin-specific components
│   ├── ui/          # Base UI components (shadcn)
│   └── [Feature]/   # Feature-specific components
├── lib/             # Utility functions & configs
├── hooks/           # Custom React hooks
├── types/           # TypeScript type definitions
└── styles/          # Global styles
```

### Rules

- **✅ DO:** Keep route groups organized by access level (`(admin)`, `(auth)`, `(public)`)
- **✅ DO:** Co-locate feature-specific components in dedicated folders
- **✅ DO:** Place shared utilities in `lib/`, not scattered across features
- **❌ DON'T:** Mix public and admin logic in the same component
- **❌ DON'T:** Create nested folders deeper than 3 levels without good reason

---

## TypeScript Guidelines

### 🚨 CRITICAL: Zero-Tolerance `any` Policy

**`any` types are STRICTLY FORBIDDEN in this codebase.**

```typescript
// ❌ NEVER ALLOWED
const data: any = await fetchData();
function process(input: any) {}
const result: any[] = [];

// ✅ ALWAYS REQUIRED: Explicit types
const data: User[] = await fetchData();
function process(input: ProcessInput): ProcessOutput {}
const result: ValidationResult[] = [];
```

### Strict Typing Rules

```typescript
// ✅ DO: Define explicit types for ALL functions
interface User {
  _id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
}

// ✅ DO: Type function parameters AND return values
function isAdmin(user: User): boolean {
  return user.role === 'admin';
}

function getUsers(): Promise<User[]> {
  return fetchUsers();
}

async function createUser(data: CreateUserInput): Promise<User> {
  return await saveUser(data);
}

// ✅ DO: Use 'unknown' for truly unknown data, then narrow
const data: unknown = await fetchData();
if (isValidData(data)) {
  // Type narrowed here - data is now properly typed
  processData(data);
}

// ✅ DO: Use generics for reusable typed functions
function findById<T extends { _id: string }>(
  items: T[],
  id: string
): T | undefined {
  return items.find((item) => item._id === id);
}

// ❌ DON'T: Omit return types
function calculate(a: number, b: number) {
  // MISSING RETURN TYPE
  return a + b;
}

// ✅ DO: Always specify return types
function calculate(a: number, b: number): number {
  return a + b;
}
```

### Type Definitions

- **✅ DO:** Define types in `src/types/` for shared models
- **✅ DO:** Use `interface` for object shapes, `type` for unions/intersections
- **✅ DO:** Export types from feature modules when needed elsewhere
- **✅ DO:** Type ALL function parameters with no exceptions
- **✅ DO:** Type ALL function return values explicitly (never rely on inference)
- **✅ DO:** Type ALL variables when type is not immediately obvious
- **✅ DO:** Use strict TypeScript compiler options in tsconfig.json
- **❌ DON'T:** Duplicate type definitions across files
- **❌ DON'T:** Use inline types for complex objects (extract to named types)
- **❌ DON'T:** Use `any` - EVER. No exceptions. Use `unknown` and type guards instead
- **❌ DON'T:** Use `@ts-ignore` or `@ts-expect-error` without documenting WHY
- **❌ DON'T:** Cast with `as any` to bypass type errors - fix the types instead

### Enums vs Union Types

```typescript
// ✅ PREFERRED: Union types for string constants
type Status = 'active' | 'inactive' | 'pending';

// ⚠️ USE SPARINGLY: Enums (only when needed for iteration or namespacing)
enum HttpStatus {
  OK = 200,
  NOT_FOUND = 404,
  SERVER_ERROR = 500,
}
```

### Handling Untyped Third-Party Libraries

```typescript
// ❌ DON'T: Use any for untyped libraries
import someLib from 'untyped-library';
const result: any = someLib.doSomething(); // NEVER

// ✅ DO: Create custom type definitions
// Create types/untyped-library.d.ts
declare module 'untyped-library' {
  export interface LibraryResult {
    success: boolean;
    data: unknown;
  }

  export function doSomething(): LibraryResult;
}

// ✅ DO: Use Context7 to research proper types
// Before using any third-party library, check Context7 for:
// - Official type definitions
// - Type usage patterns
// - Proper TypeScript integration examples

// ✅ DO: Type the result properly
interface ExpectedData {
  id: string;
  value: number;
}

const result: LibraryResult = someLib.doSomething();
if (isExpectedData(result.data)) {
  const typedData: ExpectedData = result.data;
  // Now safely typed
}
```

### Type Guards & Narrowing

```typescript
// ✅ DO: Create type guards for runtime validation
function isUser(value: unknown): value is User {
  return (
    typeof value === 'object' &&
    value !== null &&
    'email' in value &&
    typeof value.email === 'string' &&
    '_id' in value &&
    typeof value._id === 'string'
  );
}

// ✅ DO: Use type guards with unknown data
const apiResponse: unknown = await fetch('/api/user').then((r) => r.json());
if (isUser(apiResponse)) {
  // apiResponse is now typed as User
  console.log(apiResponse.email);
}

// ✅ DO: Use discriminated unions
type Result<T> = { success: true; data: T } | { success: false; error: string };

function processResult<T>(result: Result<T>): void {
  if (result.success) {
    // TypeScript knows result.data exists here
    console.log(result.data);
  } else {
    // TypeScript knows result.error exists here
    console.error(result.error);
  }
}
```

### TSConfig Strict Mode Requirements

```json
// ✅ REQUIRED: tsconfig.json must have these settings
{
  "compilerOptions": {
    "strict": true, // Enable all strict type checking
    "noImplicitAny": true, // Error on implicit any
    "strictNullChecks": true, // Strict null checking
    "strictFunctionTypes": true, // Strict function types
    "strictBindCallApply": true, // Strict bind/call/apply
    "strictPropertyInitialization": true, // Strict property initialization
    "noImplicitThis": true, // Error on implicit this
    "alwaysStrict": true, // Parse in strict mode
    "noUnusedLocals": true, // Error on unused locals
    "noUnusedParameters": true, // Error on unused parameters
    "noImplicitReturns": true, // Error on missing returns
    "noFallthroughCasesInSwitch": true, // Error on switch fallthrough
    "noUncheckedIndexedAccess": true, // Add undefined to index signatures
    "noPropertyAccessFromIndexSignature": true // Require bracket notation for index access
  }
}
```

**These settings are NON-NEGOTIABLE and must be enabled in the project.**

---

## Component Development

### Component Structure

```typescript
// ✅ DO: Follow this structure with STRICT typing
'use client'; // Only if needed

import { useState, MouseEvent } from 'react';
import { Button } from '@/components/ui/button';

// ✅ REQUIRED: Define props interface
interface MyComponentProps {
  title: string;
  onAction?: () => void;
  className?: string;
}

/**
 * Brief description of what the component does
 * @param props - Component props
 */
export function MyComponent({
  title,
  onAction,
  className,
}: MyComponentProps): JSX.Element {
  // ✅ DO: Type state explicitly when not obvious
  const [state, setState] = useState<boolean>(false);
  const [count, setCount] = useState<number>(0);

  // ✅ DO: Type event handlers explicitly
  const handleClick = (event: MouseEvent<HTMLButtonElement>): void => {
    setState(true);
    onAction?.();
  };

  // ✅ DO: Type complex state
  const [data, setData] = useState<User | null>(null);

  // Render
  return (
    <div className={className}>
      <h2>{title}</h2>
      <Button onClick={handleClick}>Action</Button>
    </div>
  );
}
```

### Component Rules

- **✅ DO:** Use function declarations (`function MyComponent`) over arrow functions
- **✅ DO:** Type ALL component props with interfaces (no implicit any)
- **✅ DO:** Type ALL event handlers explicitly
- **✅ DO:** Extract complex logic to custom hooks
- **✅ DO:** Keep components under 200 lines (split if larger)
- **✅ DO:** Use descriptive prop names (`isLoading`, not `loading`)
- **✅ DO:** Provide default props where appropriate
- **❌ DON'T:** Nest component definitions
- **❌ DON'T:** Define functions inside render (use `useCallback` if needed)
- **❌ DON'T:** Use `any` for props, state, or event handlers

### Server vs Client Components

```typescript
// ✅ DO: Default to Server Components
export default function Page() {
  return <StaticContent />;
}

// ✅ DO: Use 'use client' only when needed
('use client');
export function InteractiveWidget() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
```

**Require Client Component:**

- `useState`, `useEffect`, or other React hooks
- Event handlers (`onClick`, `onChange`)
- Browser APIs (localStorage, window, etc.)
- Third-party libraries requiring browser context

---

## Styling & UI

### Tailwind CSS v4

```typescript
// ✅ DO: Use Tailwind utility classes
<div className="flex items-center gap-4 rounded-lg bg-background p-4">

// ✅ DO: Use CSS variables for theming
<div className="bg-primary text-primary-foreground">

// ❌ DON'T: Use inline styles unless absolutely necessary
<div style={{ padding: '16px' }}> // AVOID

// ✅ DO: Use cn() utility for conditional classes
import { cn } from '@/lib/utils';
<div className={cn(
  'base-class',
  isActive && 'active-class',
  variant === 'primary' && 'primary-variant'
)}>
```

### UI Component Library (shadcn/ui)

- **✅ DO:** Use shadcn/ui components from `@/components/ui/`
- **✅ DO:** Extend shadcn components rather than creating from scratch
- **✅ DO:** Maintain consistent spacing (4, 8, 16, 24, 32, 48)
- **❌ DON'T:** Override shadcn styles arbitrarily (extend properly)
- **❌ DON'T:** Mix different component libraries

### Dark Mode

```typescript
// ✅ DO: Use CSS variables that respond to theme
bg-background text-foreground

// ✅ DO: Test components in both light and dark modes
// ❌ DON'T: Hardcode colors (e.g., bg-white, text-black)
```

### Responsive Design

```typescript
// ✅ DO: Mobile-first approach
<div className="flex flex-col md:flex-row lg:gap-8">

// ✅ DO: Test on mobile, tablet, and desktop breakpoints
```

---

## API & Data Handling

### API Routes

```typescript
import { NextRequest, NextResponse } from 'next/server';

// ✅ DO: Define request/response types
interface CreateUserRequest {
  email: string;
  name: string;
  role: 'admin' | 'user';
}

interface UserResponse {
  _id: string;
  email: string;
  name: string;
  role: string;
  createdAt: string;
}

interface ErrorResponse {
  error: string;
  details?: string;
}

// ✅ DO: Use proper HTTP methods with strict typing
export async function GET(
  request: NextRequest
): Promise<NextResponse<UserResponse[] | ErrorResponse>> {
  try {
    const users: UserResponse[] = await getUsers();
    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest
): Promise<NextResponse<UserResponse | ErrorResponse>> {
  try {
    // ✅ DO: Type and validate request body
    const body: unknown = await request.json();

    if (!isValidCreateUserRequest(body)) {
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      );
    }

    const user: UserResponse = await createUser(body);
    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// ✅ DO: Create type guard for validation
function isValidCreateUserRequest(data: unknown): data is CreateUserRequest {
  return (
    typeof data === 'object' &&
    data !== null &&
    'email' in data &&
    typeof data.email === 'string' &&
    'name' in data &&
    typeof data.name === 'string' &&
    'role' in data &&
    (data.role === 'admin' || data.role === 'user')
  );
}
```

### Data Fetching

```typescript
import { User } from '@/types';

// ✅ DO: Type the return value explicitly
async function getData(): Promise<User[]> {
  const res = await fetch('https://api.example.com/data', {
    cache: 'no-store', // or 'force-cache' for static
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch: ${res.status}`);
  }

  const data: unknown = await res.json();

  // ✅ DO: Validate response data
  if (!isUserArray(data)) {
    throw new Error('Invalid response format');
  }

  return data;
}

// ✅ DO: Create type guards for API responses
function isUserArray(data: unknown): data is User[] {
  return Array.isArray(data) && data.every((item) => isUser(item));
}

function isUser(value: unknown): value is User {
  return (
    typeof value === 'object' &&
    value !== null &&
    '_id' in value &&
    typeof value._id === 'string' &&
    'email' in value &&
    typeof value.email === 'string'
  );
}

// ✅ DO: Handle loading and error states with types
export default async function Page(): Promise<JSX.Element> {
  try {
    const data: User[] = await getData();
    return <Display data={data} />;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred';
    return <ErrorDisplay error={errorMessage} />;
  }
}

// ✅ DO: Use React Query with proper types for client-side fetching
import { useQuery } from '@tanstack/react-query';

function useUsers() {
  return useQuery<User[], Error>({
    queryKey: ['users'],
    queryFn: getData,
  });
}
```

### Form Handling

```typescript
import { FormEvent, ChangeEvent, useState } from 'react';
import { toast } from 'sonner';

// ✅ DO: Define form data type
interface FormData {
  email: string;
  name: string;
  message: string;
}

interface FormErrors {
  email?: string;
  name?: string;
  message?: string;
}

// ✅ DO: Type all form handlers
function ContactForm(): JSX.Element {
  const [formData, setFormData] = useState<FormData>({
    email: '',
    name: '',
    message: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // ✅ DO: Type change handlers
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ DO: Type validation function
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.email.includes('@')) {
      newErrors.email = 'Invalid email';
    }
    if (formData.name.length < 2) {
      newErrors.name = 'Name too short';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ✅ DO: Type submit handler
  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const response: Response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success('Message sent successfully');
        setFormData({ email: '', name: '', message: '' });
      } else {
        const error: unknown = await response.json();
        const errorMessage =
          typeof error === 'object' &&
          error !== null &&
          'error' in error &&
          typeof error.error === 'string'
            ? error.error
            : 'Failed to send message';
        toast.error(errorMessage);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'An unexpected error occurred';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return <form onSubmit={handleSubmit}>{/* Form fields */}</form>;
}
```

---

## Authentication & Security

### Protected Routes

```typescript
// ✅ DO: Use middleware or layout-level auth checks
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function AdminLayout({ children }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }

  if (session.user.role !== 'admin') {
    redirect('/unauthorized');
  }

  return <>{children}</>;
}
```

### Security Best Practices

- **✅ DO:** Validate all user input on the server
- **✅ DO:** Use environment variables for sensitive data
- **✅ DO:** Implement CSRF protection
- **✅ DO:** Sanitize user-generated content
- **✅ DO:** Use parameterized queries (prevent SQL/NoSQL injection)
- **❌ DON'T:** Expose API keys or secrets in client code
- **❌ DON'T:** Trust client-side validation alone
- **❌ DON'T:** Store passwords in plain text

### Environment Variables

```bash
# ✅ DO: Use descriptive names with prefixes
MONGODB_URI=mongodb://...
NEXTAUTH_SECRET=...
CLOUDINARY_CLOUD_NAME=...

# ✅ DO: Document required variables in README
# ❌ DON'T: Commit .env files to git
```

---

## Database Patterns

### MongoDB Connections

```typescript
// ✅ DO: Use connection pooling (cached connection)
import { getDb } from '@/lib/mongodb';

const db = await getDb();
const collection = db.collection('users');

// ✅ DO: Index frequently queried fields
await collection.createIndex({ email: 1 }, { unique: true });

// ✅ DO: Use transactions for multi-document operations
const session = client.startSession();
try {
  await session.withTransaction(async () => {
    await collection1.updateOne(..., { session });
    await collection2.insertOne(..., { session });
  });
} finally {
  await session.endSession();
}
```

### Data Models

```typescript
// ✅ DO: Define schema interfaces
interface UserDocument {
  _id: ObjectId;
  email: string;
  name: string;
  role: 'admin' | 'user';
  createdAt: Date;
  updatedAt: Date;
}

// ✅ DO: Use consistent field names
// - Use camelCase for field names
// - Include timestamps (createdAt, updatedAt)
// - Use _id for MongoDB document IDs

// ✅ DO: Validate data before insertion
const validateUser = (data: Partial<UserDocument>): boolean => {
  // Validation logic
};
```

---

## File & Naming Conventions

### Files

```
✅ DO:
- kebab-case for files: user-profile.tsx
- PascalCase for components: UserProfile.tsx
- camelCase for utilities: formatDate.ts
- SCREAMING_SNAKE_CASE for constants: API_ENDPOINTS.ts

❌ DON'T:
- Mix naming styles in the same directory
- Use spaces in filenames
```

### Variables & Functions

```typescript
// ✅ DO: camelCase for variables and functions
const userName = 'John';
function getUserData() {}

// ✅ DO: PascalCase for components and classes
class UserService {}
function UserCard() {}

// ✅ DO: SCREAMING_SNAKE_CASE for constants
const API_BASE_URL = 'https://api.example.com';
const MAX_RETRY_ATTEMPTS = 3;

// ✅ DO: Descriptive boolean names
const isLoading = true;
const hasPermission = false;
const canEdit = true;

// ❌ DON'T: Single letter variables (except loop counters)
const u = getUser(); // BAD
const user = getUser(); // GOOD
```

### Component Props

```typescript
// ✅ DO: Name props interfaces with Props suffix
interface UserCardProps {
  user: User;
  onEdit?: () => void;
  className?: string;
}

// ✅ DO: Use descriptive prop names
<Button onClick={handleSave} isLoading={isSaving} />

// ❌ DON'T: Use abbreviations unless widely understood
<Button clk={handleSave} ld={isSaving} /> // BAD
```

---

## Documentation

### Code Comments

```typescript
// ✅ DO: Comment WHY, not WHAT
// Retry logic needed because API has intermittent failures
const result = await retryRequest(apiCall, 3);

// ❌ DON'T: State the obvious
// Set the user variable to the result of getUser
const user = getUser();

// ✅ DO: Use JSDoc for functions
/**
 * Calculates the total price including tax
 * @param basePrice - The price before tax
 * @param taxRate - The tax rate as a decimal (e.g., 0.15 for 15%)
 * @returns The total price including tax
 */
function calculateTotal(basePrice: number, taxRate: number): number {
  return basePrice * (1 + taxRate);
}
```

### Documentation Files

- **✅ DO:** Create docs in `docs/` folder
- **✅ DO:** Use descriptive SCREAMING_SNAKE_CASE: `FEATURE_SETUP.md`
- **✅ DO:** Include setup, usage, and troubleshooting sections
- **✅ DO:** Update documentation when features change
- **❌ DON'T:** Let documentation become outdated

### README Requirements

Every feature should document:

1. **Purpose:** What does it do?
2. **Setup:** How to configure it?
3. **Usage:** How to use it?
4. **Examples:** Code samples
5. **Troubleshooting:** Common issues and solutions

---

## Git Workflow

### Branch Naming

```
✅ DO:
feature/user-authentication
fix/login-redirect-bug
hotfix/critical-security-patch
chore/update-dependencies
docs/api-documentation

❌ DON'T:
my-changes
test
fix
```

### Commit Messages

```
✅ DO: Use conventional commits
feat: add user profile page
fix: resolve dark mode toggle issue
docs: update API documentation
style: format code with prettier
refactor: extract user service logic
test: add unit tests for auth
chore: update dependencies

❌ DON'T: Vague messages
fixed stuff
updates
wip
```

### Pull Requests

- **✅ DO:** Fill out PR template completely
- **✅ DO:** Link related issues
- **✅ DO:** Request reviews from relevant team members
- **✅ DO:** Resolve all comments before merging
- **✅ DO:** Squash commits for clean history
- **❌ DON'T:** Merge without approval
- **❌ DON'T:** Push directly to main/production

---

## Testing

### Test Structure

```typescript
// ✅ DO: Organize tests by feature
__tests__ / components / UserCard.test.tsx;
lib / utils.test.ts;
api / users.test.ts;

// ✅ DO: Write descriptive test names
describe('UserCard', () => {
  it('displays user name and email', () => {
    // Test implementation
  });

  it('calls onEdit when edit button is clicked', () => {
    // Test implementation
  });

  it('shows loading state during data fetch', () => {
    // Test implementation
  });
});
```

### Testing Requirements

- **✅ DO:** Write tests for critical functionality
- **✅ DO:** Test edge cases and error states
- **✅ DO:** Mock external dependencies
- **✅ DO:** Aim for >80% coverage on business logic
- **❌ DON'T:** Skip tests for "simple" code
- **❌ DON'T:** Test implementation details (test behavior)

---

## Performance

### Optimization Guidelines

```typescript
// ✅ DO: Use Next.js Image component
import Image from 'next/image';
<Image src='/photo.jpg' alt='...' width={500} height={300} />;

// ✅ DO: Lazy load components
const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <LoadingSpinner />,
});

// ✅ DO: Memoize expensive calculations
const expensiveValue = useMemo(() => {
  return heavyCalculation(data);
}, [data]);

// ✅ DO: Debounce user input
const debouncedSearch = useDebouncedCallback(
  (value) => performSearch(value),
  300
);

// ✅ DO: Use server components for static content
// ✅ DO: Implement proper caching strategies
// ❌ DON'T: Fetch data in loops
// ❌ DON'T: Load entire datasets (paginate)
```

### Bundle Size

- **✅ DO:** Use tree-shaking (ES modules)
- **✅ DO:** Analyze bundle with `@next/bundle-analyzer`
- **✅ DO:** Code-split large features
- **❌ DON'T:** Import entire libraries (use named imports)

```typescript
// ❌ DON'T
import _ from 'lodash';

// ✅ DO
import { debounce } from 'lodash-es';
```

---

## Code Review Checklist

Before submitting code for review, verify:

### TypeScript (CRITICAL)

- [ ] **ZERO `any` types in the code** - No exceptions
- [ ] All functions have explicit return type annotations
- [ ] All parameters have explicit type annotations
- [ ] All component props have defined interfaces
- [ ] All event handlers are properly typed
- [ ] Type guards created for unknown/external data
- [ ] No `@ts-ignore` or `@ts-expect-error` without justification
- [ ] No type assertions with `as any`
- [ ] Context7 used to verify third-party library types

### Code Quality

- [ ] Code follows TypeScript best practices
- [ ] Components are properly typed
- [ ] No console.logs left in production code
- [ ] Error handling is implemented
- [ ] Loading states are handled
- [ ] Dark mode compatibility
- [ ] Responsive design tested
- [ ] Accessibility considerations (ARIA labels, keyboard navigation)
- [ ] No hardcoded values (use constants/env vars)
- [ ] Documentation updated
- [ ] Tests added/updated
- [ ] No linting errors
- [ ] Commit messages follow conventions

---

## Common Patterns

### Loading States

```typescript
// ✅ DO: Show loading UI
{
  isLoading ? <LoadingSpinner /> : <Content data={data} />;
}
```

### Error Handling

```typescript
// ✅ DO: Display user-friendly errors
{
  error ? (
    <Alert variant='destructive'>
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>{error.message}</AlertDescription>
    </Alert>
  ) : (
    <Content />
  );
}
```

### Toast Notifications

```typescript
// ✅ DO: Use consistent toast patterns
import { toast } from 'sonner';

// Success
toast.success('Action completed successfully');

// Error
toast.error('An error occurred');

// Loading
const toastId = toast.loading('Processing...');
// ... later
toast.success('Done!', { id: toastId });
```

---

## Resources

### 🔍 REQUIRED: Use Context7 for Library Documentation

**Before implementing ANY third-party library or framework feature:**

1. **Use Context7** to fetch up-to-date documentation
2. **Verify proper TypeScript usage** patterns
3. **Check for type definitions** and proper imports
4. **Review code examples** with correct typing
5. **Understand API signatures** before implementation

**When to use Context7:**

- Before using a new library for the first time
- When TypeScript types are unclear or missing
- Before implementing complex library features
- When debugging type errors with third-party code
- To verify you're using the latest API patterns

### Official Documentation

- **[Context7 MCP](https://context7.dev/)** - ALWAYS use for library documentation
- [Next.js Documentation](https://nextjs.org/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [TypeScript Deep Dive](https://basarat.gitbook.io/typescript/)
- [Tailwind CSS v4](https://tailwindcss.com/docs)
- [shadcn/ui](https://ui.shadcn.com/)
- [MongoDB Best Practices](https://www.mongodb.com/docs/manual/administration/production-notes/)
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)

---

## Enforcement

These rules should be:

1. **Reviewed** during code reviews
2. **Referenced** in PR feedback
3. **Updated** as patterns evolve
4. **Enforced** through linting and CI/CD

### ESLint Configuration for Type Safety

```json
// ✅ REQUIRED: .eslintrc.json must include these rules
{
  "extends": [
    "next/core-web-vitals",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking"
  ],
  "rules": {
    "@typescript-eslint/no-explicit-any": "error", // NEVER allow any
    "@typescript-eslint/no-unsafe-assignment": "error", // Prevent any assignments
    "@typescript-eslint/no-unsafe-member-access": "error", // Prevent any member access
    "@typescript-eslint/no-unsafe-call": "error", // Prevent any calls
    "@typescript-eslint/no-unsafe-return": "error", // Prevent any returns
    "@typescript-eslint/explicit-function-return-type": "warn", // Encourage return types
    "@typescript-eslint/explicit-module-boundary-types": "warn", // Encourage boundary types
    "@typescript-eslint/no-unused-vars": [
      "error",
      {
        // No unused variables
        "argsIgnorePattern": "^_",
        "varsIgnorePattern": "^_"
      }
    ],
    "@typescript-eslint/strict-boolean-expressions": "warn" // Strict boolean checks
  }
}
```

### Pre-commit Hooks (Husky)

```json
// ✅ RECOMMENDED: package.json scripts
{
  "scripts": {
    "type-check": "tsc --noEmit",
    "lint": "eslint . --ext .ts,.tsx --max-warnings 0",
    "lint:fix": "eslint . --ext .ts,.tsx --fix",
    "pre-commit": "npm run type-check && npm run lint"
  },
  "husky": {
    "hooks": {
      "pre-commit": "npm run pre-commit"
    }
  }
}
```

### CI/CD Pipeline Requirements

**All PRs MUST pass:**

1. `tsc --noEmit` - Zero TypeScript errors
2. `eslint --max-warnings 0` - Zero ESLint warnings/errors
3. No `any` types detected (automated scan)
4. All tests passing

**Blocking conditions:**

- Any use of `any` type → PR cannot be merged
- Missing function return types → Warning (must be addressed)
- `@ts-ignore` without justification → PR cannot be merged

---

## Summary: The TypeScript Commitment

### The Golden Rules

1. **`any` is banned** - No exceptions, ever
2. **All functions must be typed** - Parameters and return values
3. **Type guards for external data** - Never trust untyped sources
4. **Context7 for libraries** - Always verify types before use
5. **Strict TSConfig** - All strict settings enabled
6. **ESLint enforcement** - No compromises in CI/CD

### Why This Matters

- **Prevents runtime errors** - Catch bugs at compile time
- **Improves maintainability** - Clear contracts between code
- **Enables refactoring** - TypeScript guides changes safely
- **Better DX** - IntelliSense and autocomplete work perfectly
- **Self-documenting** - Types serve as inline documentation

---

**Remember:** TypeScript is not optional decoration—it's a critical safety net. Write code that makes the compiler happy, and runtime errors will be rare. When in doubt, make it more explicit, not less.
