# 🛒 Shopping Cart System

![Laravel](https://img.shields.io/badge/Laravel-FF2D20?style=for-the-badge&logo=laravel&logoColor=white)
![Next JS](https://img.shields.io/badge/Next-black?style=for-the-badge&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Redux](https://img.shields.io/badge/redux-%23593d88.svg?style=for-the-badge&logo=redux&logoColor=white)
![Firebase](https://img.shields.io/badge/firebase-%23039BE5.svg?style=for-the-badge&logo=firebase)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)

A full-stack shopping cart application featuring robust Firebase authentication, seamless product browsing, and persistent cart synchronization.

## 📑 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Folder Structure](#-folder-structure)
- [Prerequisites](#-prerequisites)
- [Getting Started](#-getting-started)
  - [Firebase Setup](#firebase-setup)
  - [Environment Configuration](#environment-configuration)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [API Overview](#-api-overview)
- [Architecture Notes](#-architecture-notes)
- [Testing](#-testing)

## ✨ Features

- **Authentication:** Google sign-in integrated seamlessly with Firebase Authentication.
- **Product Browsing:** Public product listing with pagination and client-side infinite scroll.
- **Shopping Cart:**
  - Authenticated and persistent cart access.
  - Optimistic UI updates on the frontend for a snappy experience.
  - Debounced batch cart synchronization to the backend.
  - Cart persistence through backend reload (without relying solely on `localStorage`).
- **Backend Architecture:** Standardized JSON API responses with robust service-layer business logic.

## 🛠 Tech Stack

### Backend (Laravel API)

- Laravel 12.x
- PHP 8.2+
- SQLite (Default) / Eloquent ORM
- Firebase JWT Auth

### Frontend (Next.js Client)

- Next.js 16 (App Router)
- React 19
- Redux Toolkit & RTK Query
- Tailwind CSS 4

## 📁 Folder Structure

```text
shopping-cart/
├── backend/   # Laravel API application
└── frontend/  # Next.js React client application
```

## ⚙️ Prerequisites

Before you begin, ensure you have the following installed:

- [PHP 8.2+](https://www.php.net/downloads.php) (Ensure the `pdo_sqlite` and `sqlite3` extensions are enabled in your `php.ini` for the default database to work)
- [Composer](https://getcomposer.org/)
- [Node.js 20+](https://nodejs.org/en/) & npm
- A [Firebase](https://firebase.google.com/) account for authentication

## 🚀 Getting Started

### Installation

Clone the repository and open your terminal at the project root:

```bash
git clone https://github.com/aynoncse/shopping-cart.git
cd shopping-cart
```

_(Alternatively, if you downloaded the project as a ZIP file, simply extract it and navigate into the `shopping-cart` folder.)_

### Firebase Setup

1. Create a project in the [Firebase Console](https://console.firebase.google.com/).
2. Navigate to **Authentication** and enable the **Google** sign-in provider.
3. Add a **Web App** to your Firebase project to generate configuration keys.
4. Note down your Firebase project ID, App ID, and keys. You will need them for the `.env` files.
5. Add your frontend origin (e.g., `http://localhost:3000`) to the **Authorized domains** in Firebase Authentication settings.

### Environment Configuration

#### Backend `backend/.env`

Copy the example file to create your local environment configuration:

```bash
cd backend
cp .env.example .env
```

_(On Windows standard command prompt, use `copy` instead of `cp`)_

Typical values to update:

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

> **Note:** `FIREBASE_ISSUER` can be derived from `FIREBASE_PROJECT_ID`, but setting it explicitly keeps the configuration clear.

#### Frontend `frontend/.env.local`

Copy the example file for the frontend:

```bash
cd frontend
cp .env.example .env.local
```

_(On Windows standard command prompt, use `copy` instead of `cp`)_

Populate it with your Firebase Web App config:

```env
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000/api
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### Backend Setup

Install dependencies and start the Laravel development server:

```bash
cd backend
composer install
php artisan key:generate
php artisan migrate --seed
php artisan storage:link
php artisan serve
```

The standard backend URL is: `http://127.0.0.1:8000`

### Frontend Setup

Install dependencies and start the Next.js development server:

```bash
cd frontend
npm install
npm run dev
```

The standard frontend URL is: `http://localhost:3000`

## 📡 API Overview

Base API URL: `http://127.0.0.1:8000/api/v1`

### 📮 Postman Collection

A ready-to-use Postman collection and environment are included in the repository to help you test the API quickly:

- **Collection:** `backend/postman/Shopping_Cart_API.json`
- **Environment:** `backend/postman/Local_Environment.json`

Import these files into your Postman workspace to explore the available endpoints.

### `GET /products` (Public)

Retrieves paginated products. Supports `page` and `per_page` query parameters.

<details>
<summary>View Response Shape</summary>

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

</details>

### `GET /cart` (Protected)

Retrieves the authenticated user's cart. Requires `Authorization: Bearer <firebase_id_token>`.

<details>
<summary>View Response Shape</summary>

```json
{
  "success": true,
  "message": "Cart retrieved successfully.",
  "data": []
}
```

</details>

### `POST /cart/sync` (Protected)

Synchronizes the cart state with the backend. Requires `Authorization: Bearer <firebase_id_token>`.

<details>
<summary>View Request/Response Shape</summary>

**Request Body:**

```json
{
  "items": [
    { "product_id": 1, "quantity": 2 },
    { "product_id": 5, "quantity": 1 }
  ]
}
```

**Success Response:**

```json
{
  "success": true,
  "message": "Cart synchronized successfully.",
  "data": []
}
```

**Validation Error Response:**

```json
{
  "success": false,
  "message": "The given data was invalid.",
  "errors": {}
}
```

</details>

## 🏗 Architecture Notes

### Backend Architecture

- **Thin Controllers:** They only coordinate request validation, authentication context, and response formatting.
- **Service Layer:** Core business logic is encapsulated in services:
  - `App\Services\Product\ProductService`
  - `App\Services\Cart\CartService`
  - `App\Services\Firebase\FirebaseAuthService`
- **Firebase Auth Integration:** Token verification is handled by custom middleware delegating to the Firebase auth service.
- **Cart Sync:** Transactional and utilizes `upsert` for efficient bulk updates.

### Frontend Architecture

- **State Management:** Redux Toolkit handles auth and cart state.
- **Data Fetching:** RTK Query manages API communication.
- **UX Optimizations:**
  - Cart changes update optimistically on the client.
  - Cart sync is debounced and flushed on window refresh/unload dynamically.
  - Infinite scroll utilizes RTK Query and `IntersectionObserver`.
  - Next.js `next/image` is used for optimized image rendering.

## 🧪 Testing

Backend test coverage currently focuses on core API behaviors:

- Product listing response structures
- Cart endpoint authentication protection
- Cart validation and sync success logic

To run the backend tests:

```bash
cd backend
php artisan test
```

> **Note:** In certain environments, `php artisan test` may fail if the SQLite PDO driver is not enabled for the in-memory test database.
