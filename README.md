# Buddha Stones Shop

A complete, production-ready e-commerce platform for spiritual jewelry and meditation supplies. Built with Next.js 14, Prisma, PostgreSQL, and Stripe.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Styling | Tailwind CSS 4 |
| Database | PostgreSQL (Vercel Postgres / Neon) |
| ORM | Prisma |
| Auth | NextAuth.js v5 |
| Payments | Stripe Checkout |
| State | Zustand |
| Icons | Lucide React |

## Quick Start

```bash
npm install
cp .env.example .env   # fill in your values
npm run db:push
npm run db:generate
npm run seed           # creates demo data (20 products, 6 categories, 5 blog posts)
npm run dev            # opens http://localhost:3000
```

## Default Admin Account (after seed)

- Email: `admin@buddhastoneshop.com`
- Password: `admin123`
- Admin panel: `/admin`

## Required Environment Variables

- `DATABASE_URL` — PostgreSQL connection string
- `AUTH_SECRET` — `openssl rand -base64 32`
- `STRIPE_SECRET_KEY` — Stripe test/production key
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` — Stripe publishable key
- `STRIPE_WEBHOOK_SECRET` — Stripe webhook signing secret

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── page.tsx            # Homepage
│   ├── products/[slug]/    # Product detail (SSR)
│   ├── collections/[slug]/ # Category listing (SSR)
│   ├── cart/               # Client-side cart
│   ├── checkout/           # Stripe Checkout flow
│   ├── blog/               # Blog with MD content
│   ├── about/ faq/         # Static pages
│   ├── admin/              # Admin dashboard
│   └── api/                # REST + Stripe webhooks
├── components/
│   ├── layout/   (Header, Footer, CartDrawer)
│   ├── product/  (Gallery, Variant, ProductCard, Grid)
│   └── ui/       (Button, Tabs)
└── lib/           (db, auth, stripe, cart, utils)
prisma/
├── schema.prisma  (User, Product, Variant, Order, Review, BlogPost)
└── seed.ts       (Demo data)
```

## Deployment

```bash
vercel deploy
```

Set all environment variables in the Vercel dashboard. Use Vercel Postgres or Neon for the database.

## Stripe Setup

**Local testing:**
```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

**Production:** Add webhook endpoint in Stripe Dashboard → `https://yourdomain.com/api/webhooks/stripe` with events: `checkout.session.completed`, `checkout.session.expired`
