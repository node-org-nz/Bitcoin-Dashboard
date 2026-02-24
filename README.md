# Bitcoin Monitor

A Next.js dashboard for "monitoring the situation" across core Bitcoin market and network metrics.

## Stack

- Next.js (App Router) + TypeScript + Tailwind CSS
- Prisma ORM configured for PostgreSQL
- Server-side data fetching from public APIs (CoinGecko + mempool.space)

## Features in v1

- BTC price (USD)
- BTC market cap
- 24h volume
- BTC dominance
- Mempool transaction count and virtual size
- Recommended fee estimates (fastest, 30m, 60m)
- Graceful fallback when an API endpoint is unavailable

## Run locally

1. Install dependencies:

```bash
npm install
```

2. Copy env template and set your database URL:

```bash
copy .env.example .env
```

3. Start dev server:

```bash
npm run dev
```

4. Open <http://localhost:3000>

## Prisma setup

The project includes a starter `MarketSnapshot` model in `prisma/schema.prisma`.

Generate Prisma client:

```bash
npx prisma generate
```

Create and apply first migration once PostgreSQL is running:

```bash
npx prisma migrate dev --name init
```

## Data sources

- <https://api.coingecko.com/api/v3/simple/price>
- <https://api.coingecko.com/api/v3/global>
- <https://mempool.space/api/mempool>
- <https://mempool.space/api/v1/fees/recommended>