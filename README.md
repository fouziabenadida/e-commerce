# NOVA — Premium E-Commerce Store

A full-stack e-commerce storefront built with Next.js (App Router), TypeScript,
Prisma, NextAuth, Tailwind CSS and shadcn/ui. The database is **PostgreSQL
running in Docker**.

## Stack

- **Framework**: Next.js 16 (App Router + Server Actions, Turbopack)
- **Language**: TypeScript
- **Database**: PostgreSQL 16 (Docker Compose) via Prisma ORM
- **Auth**: NextAuth v5 (credentials + role-based access: `USER` / `ADMIN`)
- **UI**: Tailwind CSS v4 + shadcn/ui components (Radix UI)

## Features

- Product catalog with categories, search, filters and pagination
- Product detail pages with image galleries and reviews
- Shopping cart and wishlist
- Checkout (mock payment) creating real orders with stock decrement
- User accounts: order history and order tracking
- Admin panel: dashboard stats, product CRUD, order status management
- Seeded demo data: 6 categories, 36 products, reviews, users, sample order

## Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (must be **running** before starting)
- Node.js ≥ 20

## Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env         # then fill in AUTH_SECRET if needed

# 3. Start the database (Docker Desktop must be open!)
npm run db:up

# 4. Create tables (first run only)
npm run db:migrate -- --name init

# 5. Seed demo data (first run only)
npm run db:seed

# 6. Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

> Remember: **two things must run** — Docker Desktop (the database is inside it)
> and the dev server. Stop the database with `npm run db:down`.

## Demo Accounts

| Role  | Email                  | Password  |
|-------|------------------------|-----------|
| Admin | `admin@shopdemo.com`   | `admin123`|
| User  | `demo@shopdemo.com`    | `user123` |

## Scripts

| Script          | Purpose                                   |
|-----------------|-------------------------------------------|
| `npm run dev`   | Start dev server (Turbopack)              |
| `npm run build` | Production build                          |
| `npm run start` | Serve the production build                |
| `npm run lint`  | ESLint                                    |
| `npm run db:up` | Start PostgreSQL container                |
| `npm run db:down` | Stop PostgreSQL container               |
| `npm run db:migrate` | Create/apply a Prisma migration       |
| `npm run db:seed` | Seed the database with demo data        |
| `npm run db:studio` | Open Prisma Studio (DB browser)        |

## Database Reset

To wipe and rebuild the database from scratch:

```bash
npm run db:down
docker compose down -v    # -v also deletes the volume (all data)
npm run db:up
npm run db:migrate -- --name init
npm run db:seed
```

## Project Structure

```
prisma/                 # Schema, migrations, seed script
src/app/                # App Router routes (pages)
  └─ (shop)/            #   Storefront: /
  └─ account/           #   User account + orders
  └─ admin/             #   Admin panel (products, orders)
  └─ auth/              #   Login / register / error pages
  └─ cart, wishlist, checkout
  └─ api/auth/[...nextauth]/   # NextAuth handler
src/app/actions/        # Server actions (auth, orders, admin, reviews)
src/components/         # UI components (shadcn/ui + feature components)
src/lib/                # Utilities (auth, prisma client, products)
src/types/              # Shared TypeScript types
docker-compose.yml      # PostgreSQL service definition
```