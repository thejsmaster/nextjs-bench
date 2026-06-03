import { NextApiRequest, NextApiResponse } from "next";
import http from "node:http";
import { getDb } from "../../lib/db";
import os from "node:os";

interface BenchResult {
  name: string;
  iterations: number;
  avgMs: number;
  minMs: number;
  maxMs: number;
  ops: number;
}

interface ServerInfo {
  framework: string;
  node: string;
  platform: string;
  arch: string;
  cpuCount: number;
  memory: string;
}

function httpGet(port: number): Promise<string> {
  return new Promise((resolve, reject) => {
    http
      .get(`http://localhost:${port}/`, (res) => {
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => resolve(data));
      })
      .on("error", reject);
  });
}

async function bench(
  name: string,
  fn: () => Promise<void>,
  iterations: number,
): Promise<BenchResult> {
  for (let i = 0; i < Math.min(iterations, 5); i++) {
    try { await fn(); } catch {}
  }
  const times: number[] = [];
  for (let i = 0; i < iterations; i++) {
    try {
      const start = performance.now();
      await fn();
      times.push(performance.now() - start);
    } catch {}
  }
  if (times.length === 0) {
    return { name, iterations: 0, avgMs: 0, minMs: 0, maxMs: 0, ops: 0 };
  }
  const totalMs = times.reduce((a, b) => a + b, 0);
  const avgMs = totalMs / times.length;
  return {
    name,
    iterations: times.length,
    avgMs: Math.round(avgMs * 100) / 100,
    minMs: Math.round(Math.min(...times) * 100) / 100,
    maxMs: Math.round(Math.max(...times) * 100) / 100,
    ops: Math.round(1000 / avgMs),
  };
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const iterations = req.body?.iterations ?? 30;
  const port = parseInt(process.env.PORT || "3001", 10);

  // Warm DB
  getDb();
  try { await httpGet(port); } catch {}

  const results: BenchResult[] = [];

  // Benchmark 1: SSR dashboard
  results.push(
    await bench(
      "SSR / (dashboard, 5 SQLite queries)",
      async () => { await httpGet(port); },
      iterations,
    ),
  );

  // Benchmark 2: Raw SQLite queries
  const db = getDb();
  if (db) {
    results.push(
      await bench(
        "SQLite: 5 queries (match SSR)",
        async () => {
          db.prepare("SELECT COUNT(*) as total, AVG(price) as avgPrice, SUM(stock) as totalStock, COUNT(DISTINCT category) as categories FROM products").get();
          db.prepare("SELECT DISTINCT category FROM products ORDER BY category").all();
          db.prepare("SELECT COUNT(*) as total, SUM(CASE WHEN role = 'admin' THEN 1 ELSE 0 END) as adminCount FROM users").get();
          db.prepare("SELECT COUNT(*) as total, SUM(total) as totalRevenue, AVG(total) as avgOrderValue FROM orders").get();
          db.prepare("SELECT o.*, u.name as user_name, p.name as product_name FROM orders o LEFT JOIN users u ON u.id = o.user_id LEFT JOIN products p ON p.id = o.product_id ORDER BY o.created_at DESC LIMIT 10").all();
        },
        iterations,
      ),
    );

    results.push(
      await bench(
        "SQLite: COUNT(*) products",
        async () => {
          db.prepare("SELECT COUNT(*) as count FROM products").get();
        },
        iterations * 3,
      ),
    );
  }

  // Benchmark 3: SSR x5 concurrent
  results.push(
    await bench(
      "SSR ×5 concurrent",
      async () => {
        await Promise.all([
          httpGet(port), httpGet(port), httpGet(port), httpGet(port), httpGet(port),
        ]);
      },
      Math.floor(iterations / 2),
    ),
  );

  const serverInfo: ServerInfo = {
    framework: "Next.js",
    node: process.version,
    platform: process.platform,
    arch: process.arch,
    cpuCount: os.cpus().length,
    memory: (os.totalmem() / 1024 / 1024 / 1024).toFixed(1) + " GB",
  };

  res.json({ results, serverInfo });
}
