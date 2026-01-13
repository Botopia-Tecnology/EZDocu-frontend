# EZDocu Frontend

This is the Next.js frontend for EZDocu, featuring a modern dashboard, authentication integrating with the `auth-ms` microservice, and role-based access control.

## Features

- **Authentication**: JWT-based login/signup powered by the backend `auth-ms`.
- **RBAC**: 
    - **Context**: `AuthContext` provides global user state and role checking (`hasRole`, `hasGlobalRole`).
    - **Middleware**: Protected routes (`/admin`, `/dashboard`) via `middleware.ts`.
- **Dashboards**:
    - **Admin Dashboard** (`/admin`): For SaaS superadmins.
    - **User Dashboard** (`/dashboard`): Tailored views for `Owner` vs `Member`.
- **UI**: Built with [shadcn/ui](https://ui.shadcn.com/) and Tailwind CSS.
- **Data Fetching**: Refactored to use Server Actions and Client Context (replacing some legacy SWR patterns).

## Getting Started

### Prerequisites
*   Ensure the Backend (`auth-ms` and `api-gateway`) is running.

### Installation

```bash
cd frontend
pnpm install
```

### Environment Variables
Create a `.env` file based on `.env.example`:

```env
NEXT_PUBLIC_API_URL="http://localhost:3000" # URL of the API Gateway
AUTH_SECRET="your_matching_jwt_secret" # Must match backend JWT_SECRET for verifying tokens in middleware
```

### Running Locally

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) (default port may vary if 3000 is taken, typically Next.js uses 3000).

## Testing Roles (Login Credentials)

The database seed provides the following users for testing RBAC functionality:

| Role | Email | Password | Access |
| :--- | :--- | :--- | :--- |
| **SaaS Admin** | `admin@ezdocu.com` | `password123` | Access to `/admin` and `/dashboard`. |
| **Owner** | `owner@agency.com` | `password123` | Access to `/dashboard` (Team Management visible). |
| **Member** | `member@agency.com` | `password123` | Access to `/dashboard` (Restricted view). |

## Project Structure

*   `app/(login)`: Login and Registration pages (`sign-in`, `sign-up`).
*   `app/(dashboard)`: Authenticated dashboard layouts.
    *   `admin/`: Routes specific to Global Admins.
    *   `dashboard/`: General dashboard for Account Users.
*   `lib/auth`: Authentication logic (Session management, Context).
*   `middleware.ts`: Route protection logic.
