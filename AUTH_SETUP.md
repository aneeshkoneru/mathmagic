# Authentication Setup Guide

This project uses NextAuth.js v5 with Supabase for authentication.

## Setup Instructions

### 1. Install Dependencies

First, install the required packages:

```bash
npm install next-auth@beta @supabase/supabase-js
```

### 2. Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://naehyqlgbdgynxftcpzc.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5hZWh5cWxnYmRneW54ZnRjcHpjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM1ODc1MDYsImV4cCI6MjA3OTE2MzUwNn0.s84W7a8yZKB-ze4rhlCMA3_IasBc36AcLpAgO3Lnyk4

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-change-this-in-production
```

**Important:** Generate a secure random string for `NEXTAUTH_SECRET`. You can use:
```bash
openssl rand -base64 32
```

### 3. Supabase Setup

Make sure your Supabase project has:
- Email authentication enabled
- User registration enabled (if you want sign-up functionality)

## Features

### Authentication Pages

- **Sign In**: `/auth/signin` - User login page
- **Sign Up**: `/auth/signup` - User registration page
- **Sign Out**: `/auth/signout` - Logout page
- **Error**: `/auth/error` - Authentication error page

### Protected Routes

The middleware automatically protects routes (except public routes). Protected routes include:
- `/dashboard` - Requires authentication

Public routes (no authentication required):
- `/` - Home page
- `/auth/*` - Authentication pages

### Usage in Components

#### Using the Session Hook

```tsx
'use client'

import { useSession } from '@/lib/useSession'

export default function MyComponent() {
  const { user, isAuthenticated, isLoading } = useSession()

  if (isLoading) return <div>Loading...</div>
  if (!isAuthenticated) return <div>Please sign in</div>

  return <div>Welcome, {user?.email}!</div>
}
```

#### Server-Side Session Access

```tsx
import { auth } from '@/lib/auth'

export default async function ServerComponent() {
  const session = await auth()
  
  if (!session) {
    return <div>Not authenticated</div>
  }

  return <div>Welcome, {session.user?.email}!</div>
}
```

#### Sign Out

```tsx
'use client'

import { signOut } from 'next-auth/react'

export default function SignOutButton() {
  return (
    <button onClick={() => signOut()}>
      Sign Out
    </button>
  )
}
```

## File Structure

```
├── app/
│   ├── api/
│   │   └── auth/
│   │       └── [...nextauth]/
│   │           └── route.ts          # NextAuth API route
│   ├── auth/
│   │   ├── signin/
│   │   │   └── page.tsx              # Sign in page
│   │   ├── signup/
│   │   │   └── page.tsx              # Sign up page
│   │   ├── signout/
│   │   │   └── page.tsx              # Sign out page
│   │   └── error/
│   │       └── page.tsx              # Error page
│   └── layout.tsx                    # Root layout with SessionProvider
├── components/
│   ├── Header.tsx                    # Header with user info and sign out
│   └── SessionProvider.tsx           # NextAuth session provider wrapper
├── lib/
│   ├── auth.ts                       # NextAuth configuration
│   ├── supabase.ts                   # Supabase client
│   └── useSession.ts                 # Custom session hook
└── middleware.ts                     # Route protection middleware
```

## Testing

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Navigate to `http://localhost:3000/auth/signup` to create an account
3. Sign in at `http://localhost:3000/auth/signin`
4. Access protected routes like `/dashboard`

## Notes

- The authentication uses JWT strategy for sessions
- User credentials are validated against Supabase
- Protected routes automatically redirect to sign-in if not authenticated
- Authenticated users are redirected away from auth pages to the dashboard

