# Apna Karigar — اپنا کاریگر

Pakistan's Trust-First Home Services Platform

> Connecting verified home-service professionals with customers across Pakistan's urban cities.

---

## Project Structure

```
apna-karigar/
├── backend/          # Node.js + Express REST API
│   ├── config/       # MongoDB connection
│   ├── middleware/   # JWT auth middleware
│   ├── models/       # Mongoose schemas (User, Worker, Booking, Review)
│   ├── routes/       # API route handlers
│   ├── scripts/      # Seed script (creates admin user)
│   └── server.js     # App entry point
└── frontend/         # React + Vite SPA
    └── src/
        ├── components/   # Navbar, StarRating, LoadingSpinner, ProtectedRoute
        ├── context/      # AuthContext (JWT auth state)
        ├── pages/
        │   ├── admin/    # Admin portal (Dashboard, PendingVerifications, AllUsers, AllWorkers)
        │   ├── worker/   # Worker portal (Dashboard, JobRequests, BookingHistory, Earnings)
        │   └── (customer pages: Home, WorkerList, WorkerProfile, BookNow, MyBookings, LeaveReview)
        └── utils/        # Axios instance with auth interceptors
```

---

## Quick Start

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (free tier is fine)
- pnpm or npm

---

### 1. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env` and set:
```
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster0.xxxx.mongodb.net/apna-karigar
JWT_SECRET=your_long_random_secret_here
PORT=5000
```

**Seed the admin user:**
```bash
node scripts/seed.js
```

**Start the backend:**
```bash
npm run dev     # development (with nodemon)
npm start       # production
```

The API will run at `http://localhost:5000`

---

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The app will open at `http://localhost:3000`

> The Vite dev server proxies `/api` requests to `localhost:5000` automatically.

---

## Default Admin Account

After running the seed script:

| Field    | Value                         |
|----------|-------------------------------|
| Email    | admin@apnakarigar.com         |
| Password | admin123                      |
| Role     | admin                         |

**Change the password after first login in production.**

---

## Features

### Customer Portal
- Browse & search verified workers by category, city, or name
- View detailed worker profiles with ratings and reviews
- Book a worker with date/time and address
- Track booking status: Pending → Confirmed → Completed
- Leave star ratings and written reviews after job completion

### Worker (Karigar) Portal
- Register with CNIC for identity verification
- Receive job requests from customers
- Accept or decline bookings
- Mark jobs as completed
- View earnings summary and performance stats

### Admin Panel
- Review and approve/reject worker ID applications
- View all customers and workers
- Real-time platform statistics
- Remove users or workers if needed

---

## API Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | /api/auth/register | Register customer or worker | Public |
| POST | /api/auth/login | Login & get JWT token | Public |
| GET | /api/auth/me | Get current user | JWT |
| GET | /api/workers | List verified workers | Public |
| GET | /api/workers/:id | Worker profile + reviews | Public |
| GET | /api/workers/my/profile | My worker profile | Worker |
| PUT | /api/workers/profile | Update my profile | Worker |
| POST | /api/bookings | Create booking | Customer |
| GET | /api/bookings/my | My bookings | Auth |
| PATCH | /api/bookings/:id/status | Update booking status | Auth |
| POST | /api/reviews | Submit review | Customer |
| GET | /api/admin/stats | Platform statistics | Admin |
| GET | /api/admin/workers/pending | Unverified workers | Admin |
| PATCH | /api/admin/workers/:id/verify | Approve/reject worker | Admin |
| GET | /api/admin/workers | All workers | Admin |
| GET | /api/admin/users | All customers | Admin |
| DELETE | /api/admin/users/:id | Delete user | Admin |
| DELETE | /api/admin/workers/:id | Remove worker | Admin |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite |
| Routing | React Router v6 |
| HTTP Client | Axios |
| Backend | Node.js + Express 5 |
| Database | MongoDB + Mongoose |
| Authentication | JWT (jsonwebtoken) |
| Password Hashing | bcryptjs |
| File Uploads | multer |

---

## Deployment

**Backend** — Deploy to Render, Railway, or any Node.js host:
1. Set environment variables (MONGODB_URI, JWT_SECRET, PORT)
2. Build command: `npm install`
3. Start command: `node server.js`

**Frontend** — Deploy to Vercel or Netlify:
1. Build command: `npm run build`
2. Output directory: `dist`
3. Set env: `VITE_API_URL` if not using proxy (update axios baseURL)

---

## Team

- Muhammad Usman Zafar
- Muhammad Ali Afzal
- Furqan Tariq

---

*اپنا کاریگر — آپ کا اپنا*
