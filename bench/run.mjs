#!/usr/bin/env node
/**
 * run.mjs
 * Seeds the database, starts the Next.js production server, and runs SSR benchmarks.
 *
 * Usage:
 *   node bench/run.mjs
 *
 * Requires: npm run build completed first, or runs dev mode.
 */

import { spawn } from "node:child_process";
import http from "node:http";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const APP_DIR = path.resolve(__dirname, "..");

// Step 1: Remove old DB
const dbPath = path.resolve(APP_DIR, "data/bench.db");
if (fs.existsSync(dbPath)) fs.unlinkSync(dbPath);

// Step 2: Seed the database
console.log("\n=== Seeding Database ===\n");
const seed = spawn("npx", ["tsx", "lib/seed.ts", "1000", "500", "5000"], {
  cwd: APP_DIR,
  stdio: "inherit",
});

await new Promise((resolve, reject) => {
  seed.on("close", (code) => {
    if (code === 0) resolve();
    else reject(new Error(`Seed failed with code ${code}`));
  });
});

// Step 3: Start production server
console.log("\n=== Starting Next.js Server ===\n");
const server = spawn("npx", ["next", "start", "-p", "3456"], {
  cwd: APP_DIR,
  stdio: ["ignore", "pipe", "pipe"],
  env: { ...process.env, PORT: "3456" },
});

server.stderr.on("data", (d) => process.stderr.write(d));

// Wait for server to be ready
await new Promise((resolve) => {
  const check = () => {
    const req = http.get("http://localhost:3456/", (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        if (data.includes("Next.js SSR Benchmark")) resolve();
        else setTimeout(check, 200);
      });
    });
    req.on("error", () => setTimeout(check, 200));
  };
  setTimeout(check, 2000);
});

// Step 4: Run benchmarks
console.log("\n=== Running SSR Benchmarks ===\n");

async function bench(name, fn, iterations) {
  for (let i = 0; i < Math.min(iterations, 5); i++) {
    try { await fn(); } catch {}
  }

  const times = [];
  for (let i = 0; i < iterations; i++) {
    try {
      const start = performance.now();
      await fn();
      times.push(performance.now() - start);
    } catch {}
  }

  if (times.length === 0) return { name, iterations: 0, avgMs: 0 };

  const totalMs = times.reduce((a, b) => a + b, 0);
  const avgMs = totalMs / times.length;
  const minMs = Math.min(...times);
  const maxMs = Math.max(...times);
  const ops = Math.round(1000 / avgMs);

  return {
    name,
    iterations: times.length,
    totalMs: Math.round(totalMs),
    avgMs: Math.round(avgMs * 100) / 100,
    ops,
    minMs: Math.round(minMs * 100) / 100,
    maxMs: Math.round(maxMs * 100) / 100,
  };
}

function httpGet(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => resolve(data));
    }).on("error", reject);
  });
}

const BENCH_ITERATIONS = 50;

const dashResult = await bench(
  "SSR / (dashboard, 5 SQLite queries)",
  async () => { await httpGet("http://localhost:3456/"); },
  BENCH_ITERATIONS,
);

const concResult = await bench(
  "SSR ×5 concurrent",
  async () => {
    await Promise.all([
      httpGet("http://localhost:3456/"),
      httpGet("http://localhost:3456/"),
      httpGet("http://localhost:3456/"),
      httpGet("http://localhost:3456/"),
      httpGet("http://localhost:3456/"),
    ]);
  },
  Math.floor(BENCH_ITERATIONS / 2),
);

const results = [dashResult, concResult];

console.log("\n=== Results ===\n");
console.log(
  `${"Benchmark".padEnd(40)} ${"Iter".padEnd(6)} ${"Avg (ms)".padEnd(10)} ${"Min (ms)".padEnd(10)} ${"Max (ms)".padEnd(10)} ${"Ops/s".padEnd(8)}`
);
console.log("-".repeat(84));
for (const r of results) {
  console.log(
    `${r.name.padEnd(40)} ${String(r.iterations).padEnd(6)} ${String(r.avgMs).padEnd(10)} ${String(r.minMs).padEnd(10)} ${String(r.maxMs).padEnd(10)} ${String(r.ops).padEnd(8)}`
  );
}

server.kill();
process.exit(0);
