# E-Commerce Backend

Backend REST API untuk platform e-commerce menggunakan **Express.js + TypeScript + PostgreSQL + Prisma + Socket.IO**.

## Tech Stack

- **Runtime**: Node.js + TypeScript
- **Framework**: Express.js v4
- **Database**: PostgreSQL
- **ORM**: Prisma v5
- **Auth**: JWT (Access Token 15m + Refresh Token 7d)
- **Real-time**: Socket.IO
- **Validation**: Zod
- **Security**: Helmet, CORS, Rate Limiting

---

## Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup Environment Variables
```bash
cp .env.example .env
# Edit .env sesuai konfigurasi PostgreSQL kamu
```

### 3. Setup Database
```bash
# Generate Prisma client
npm run prisma:generate

# Jalankan migration
npm run prisma:migrate

# Seed data awal
npm run seed
```

### 4. Jalankan Server
```bash
# Development (hot reload)
npm run dev

# Production
npm run build && npm start
```

---

## API Endpoints

| Method | Endpoint | Auth | Deskripsi |
|--------|----------|------|-----------|
| POST | `/api/auth/register` | Public | Daftar akun |
| POST | `/api/auth/login` | Public | Login |
| POST | `/api/auth/refresh` | Public | Refresh token |
| POST | `/api/auth/logout` | Public | Logout |
| GET | `/api/auth/me` | Bearer | Get profil sendiri |
| GET | `/api/products` | Public | List produk |
| GET | `/api/categories` | Public | List kategori |
| GET | `/api/cart` | Bearer | Get cart |
| GET | `/api/orders` | Bearer | List order |
| GET | `/api/addresses` | Bearer | List alamat |
| GET | `/api/admin/dashboard/stats` | Admin | Dashboard stats |

---

## Login Credentials (Seed)

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@ecommerce.com | Admin@12345 |
| Customer | customer@example.com | Customer@12345 |

---

## Health Check
```
GET http://localhost:5000/health
```
