# Shopping Cart System

A full-stack shopping cart application built with Laravel and Next.js, featuring Firebase authentication, product browsing, and persistent cart synchronization.

## Stack

- Backend: Laravel 12, PHP 8.2, Eloquent ORM
- Frontend: Next.js 16, React 19
- State management: Redux Toolkit
- API integration: RTK Query
- Authentication: Firebase Authentication with Google Sign-in

## Folder Structure

```text
shopping-cart/
|- backend/   # Laravel API
`- frontend/  # Next.js client
```

## Features

- Google sign-in with Firebase Authentication
- Public product listing with pagination and infinite scroll
- Authenticated cart access
- Optimistic cart updates on the frontend
- Debounced batch cart sync to the backend
- Cart persistence through backend reload, without localStorage
- Standardized JSON API responses
- Service-layer business logic on the backend

## Setup

### Backend

```bash
cd backend
composer install
copy .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan storage:link
php artisan serve
```

Default backend URL:

```text
http://127.0.0.1:8000
```

### Frontend

```bash
cd frontend
npm install
copy .env.example .env.local
npm run dev
```

Default frontend URL:

```text
http://localhost:3000
```

## Environment Configuration

### Backend `backend/.env`

Copy `backend/.env.example` to `backend/.env` and set the values you use locally.

Typical values:

```env
APP_URL=http://127.0.0.1:8000
DB_CONNECTION=sqlite

FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_ISSUER=https://securetoken.google.com/your-firebase-project-id
FIREBASE_PUBLIC_KEYS_URL=https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com

SESSION_DRIVER=database
QUEUE_CONNECTION=database
CACHE_STORE=database
```

`FIREBASE_ISSUER` can be derived from `FIREBASE_PROJECT_ID`, but setting it explicitly keeps the configuration clear.

### Frontend `frontend/.env.local`

Copy `frontend/.env.example` to `frontend/.env.local`.

```env
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000/api
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

## Firebase Setup

1. Create a Firebase project.
2. Enable `Authentication`.
3. Enable the `Google` sign-in provider.
4. Add a Firebase web app.
5. Copy the Firebase web config values into `frontend/.env.local`.
6. Copy the Firebase project values into `backend/.env`.
7. Add the frontend origin to the allowed auth domains in Firebase.

## API Overview

Base URL:

```text
http://127.0.0.1:8000/api/v1
```

### `GET /products`

Public endpoint.

Query params:

- `page`
- `per_page`

Response shape:

```json
{
  "success": true,
  "message": "Products retrieved successfully.",
  "data": [],
  "meta": {
    "current_page": 1,
    "last_page": 10,
    "per_page": 12,
    "total": 120
  }
}
```

### `GET /cart`

Protected endpoint.

Headers:

```text
Authorization: Bearer <firebase_id_token>
```

Response shape:

```json
{
  "success": true,
  "message": "Cart retrieved successfully.",
  "data": []
}
```

### `POST /cart/sync`

Protected endpoint.

Headers:

```text
Authorization: Bearer <firebase_id_token>
Content-Type: application/json
```

Request body:

```json
{
  "items": [
    { "product_id": 1, "quantity": 2 },
    { "product_id": 5, "quantity": 1 }
  ]
}
```

An empty cart is valid:

```json
{
  "items": []
}
```

Success response:

```json
{
  "success": true,
  "message": "Cart synchronized successfully.",
  "data": []
}
```

Validation error response:

```json
{
  "success": false,
  "message": "The given data was invalid.",
  "errors": {}
}
```

## Architecture Notes

### Backend

- Controllers are thin and only coordinate request validation, authentication context, and response formatting.
- Service classes contain business logic:
  - `App\Services\Product\ProductService`
  - `App\Services\Cart\CartService`
  - `App\Services\Firebase\FirebaseAuthService`
- Firebase token verification is handled by custom middleware that delegates to the Firebase auth service.
- Cart synchronization is transactional and uses `upsert` for bulk updates.

### Frontend

- Redux Toolkit stores auth and cart state.
- RTK Query manages API communication for products and cart operations.
- Cart updates are optimistic on the client.
- Cart synchronization is debounced and flushed on refresh/unload when needed.
- Infinite scroll is handled client-side with RTK Query and `IntersectionObserver`.
- Product and cart images are rendered with `next/image`.

## Testing

Backend coverage currently focuses on API behavior:

- product listing response shape
- cart authentication protection
- cart validation behavior
- cart sync success behavior

Run:

```bash
cd backend
php artisan test
```

Note:

- In this environment, `php artisan test` may fail if PHP does not have the SQLite PDO driver enabled for the in-memory test database.
