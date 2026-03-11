# Inventory Management System

Full-stack inventory management application with:

- Frontend: Next.js 16, React 19
- Backend: Laravel 12 (API), Sanctum authentication
- Database: PostgreSQL (configured in server .env)

## Deployment

- Live application: https://optimistic-rejoicing-production.up.railway.app/login

## Project Structure

- client: Next.js frontend application
- server: Laravel API backend
- railway.json: deployment-related config

## Features

- Authentication with token-based access
- User management
- Cupboard management
- Place management
- Item management
- Borrow and return workflows
- Activity log tracking

## Prerequisites

Install these before running the project:

- Node.js 20+ and npm
- PHP 8.2+
- Composer 2+
- PostgreSQL

## Quick Start

### 1. Clone and enter the repository

```bash
git clone <your-repo-url>
cd assignment
```

### 2. Setup the backend (Laravel)

```bash

```

Edit server/.env and provide your PostgreSQL credentials:

```env

```

Run migrations:

```bash
php artisan migrate
```

Optional: create default admin user:

```bash

```

Default admin from helper route:

- email: admin@test.com
- password: 123456

### 3. Setup the frontend (Next.js)

Open a new terminal:

```bash
cd client
npm install
```

Create client/.env.local with:

```env
```

### 4. Run both apps

Terminal 1 (backend):

```bash
cd server
php artisan serve
```

Terminal 2 (frontend):

```bash
cd client
npm run dev
```



## Useful Commands

### Backend

```bash
cd server
php artisan serve
php artisan migrate
php artisan test
```

### Frontend

```bash
cd client
npm run dev
npm run build
npm run start
npm run lint
```

## API Routes (Protected by Sanctum)

Public:

- POST /api/login
- GET /api/test
- GET /api/create-admin

Protected (requires Bearer token):

- POST /api/create-user
- GET /api/users
- Resource routes: /api/cupboards, /api/places, /api/items
- GET /api/activity-logs
- POST /api/borrow
- POST /api/return/{id}
- GET /api/borrow
- GET /api/return

## Authentication Flow

1. Frontend logs in via POST /api/login.
2. Token is saved in localStorage.
3. Axios request interceptor attaches Authorization: Bearer <token>.
4. Backend validates token with Sanctum.
5. On 401, frontend clears token/user and redirects to /login.

## Troubleshooting

- If php artisan serve fails:
	- Ensure PHP 8.2+ is installed and available in PATH.
	- Ensure .env exists and APP_KEY is generated.
- If npm run dev fails in client:
	- Run npm install first.
	- Ensure Node.js version is compatible with Next.js 16.
- If login fails:
	- Verify NEXT_PUBLIC_API_URL points to the running Laravel API.
	- Confirm the backend server is running and migrations are applied.

## Notes

- Existing client and server README files are framework defaults.
- This root README is the primary guide for this repository.
