# Next.js SSR Benchmark

A Next.js SSR benchmark app that mirrors the [mates-bench](https://github.com/your-org/mates/tree/main/mates-fullstack/bench-app) app exactly.

Same SQLite schema, same data (1000 products, 500 users, 5000 orders), same 5 queries per SSR request, same dashboard UI.

## Setup

```bash
# Install dependencies
npm install

# Build Next.js
npm run build

# Seed the database (1000 products, 500 users, 5000 orders)
npm run seed

# Start production server
npm start

# In another terminal — run the load test
node bench/load-test.mjs --url http://localhost:3001/ --concurrency 10 --duration 20
```

## Benchmarks

```bash
# Full automated benchmark (seed + start + benchmark)
node bench/run.mjs

# Manual load test
node bench/load-test.mjs --url http://localhost:3001/ --concurrency 10 --duration 20
node bench/load-test.mjs --url http://localhost:3001/ --concurrency 1000 --duration 20
node bench/load-test.mjs --url http://localhost:3001/ --concurrency 10000 --duration 20
```

## What it does

- SQLite via `better-sqlite3`
- 3 tables: products, users, orders
- 5 queries per SSR request (product stats, categories, user stats, order stats, recent orders)
- Renders exact same dashboard UI as mates-bench
- Uses `getServerSideProps` for SSR (all data fetched before render)
