#!/usr/bin/env node
/**
 * load-test.mjs
 * Hammers a URL and reports throughput, latency distribution, and error rate.
 *
 * Usage:
 *   node bench/load-test.mjs                        # defaults to http://localhost:3000/
 *   node bench/load-test.mjs --url http://localhost:3001/ --concurrency 10 --duration 20
 */

import https from "node:https";
import http from "node:http";

const args = process.argv.slice(2);
const get = (flag, def) => {
  const i = args.indexOf(flag);
  return i !== -1 ? args[i + 1] : def;
};

const BASE_URL = get("--url", "http://localhost:3000/");
const CONCURRENCY = parseInt(get("--concurrency", "10"), 10);
const DURATION_S = parseInt(get("--duration", "20"), 10);
const WARMUP_S = parseInt(get("--warmup", "3"), 10);

function request(url) {
  return new Promise((resolve) => {
    const start = performance.now();
    const lib = url.startsWith("https") ? https : http;
    const req = lib.get(url, { timeout: 10000 }, (res) => {
      res.resume();
      res.on("end", () =>
        resolve({
          ok: res.statusCode < 400,
          ms: performance.now() - start,
          status: res.statusCode,
        }),
      );
    });
    req.on("error", () =>
      resolve({ ok: false, ms: performance.now() - start, status: 0 }),
    );
    req.on("timeout", () => {
      req.destroy();
      resolve({ ok: false, ms: 10000, status: 0 });
    });
  });
}

function percentile(sorted, p) {
  const i = Math.ceil((p / 100) * sorted.length) - 1;
  return sorted[Math.max(0, i)];
}

function printResults(label, results, elapsed) {
  if (!results.length) {
    console.log(`${label}: no results`);
    return;
  }
  const ok = results.filter((r) => r.ok);
  const errors = results.length - ok.length;
  const times = ok.map((r) => r.ms).sort((a, b) => a - b);
  const rps = (results.length / elapsed).toFixed(1);
  const avg = (times.reduce((a, b) => a + b, 0) / times.length).toFixed(1);

  console.log(`\n${"─".repeat(60)}`);
  console.log(`  ${label}`);
  console.log(`${"─".repeat(60)}`);
  console.log(`  Requests      ${results.length}  (${ok.length} ok, ${errors} errors)`);
  console.log(`  Duration      ${elapsed.toFixed(1)}s`);
  console.log(`  Throughput    ${rps} req/s`);
  console.log(`  Latency avg   ${avg} ms`);
  console.log(`  Latency p50   ${percentile(times, 50).toFixed(1)} ms`);
  console.log(`  Latency p95   ${percentile(times, 95).toFixed(1)} ms`);
  console.log(`  Latency p99   ${percentile(times, 99).toFixed(1)} ms`);
  console.log(`  Latency min   ${times[0].toFixed(1)} ms`);
  console.log(`  Latency max   ${times[times.length - 1].toFixed(1)} ms`);
  if (errors) {
    const codes = {};
    results.filter((r) => !r.ok).forEach((r) => {
      codes[r.status] = (codes[r.status] || 0) + 1;
    });
    console.log(`  Errors        ${JSON.stringify(codes)}`);
  }
}

async function runWorkers(url, concurrency, durationMs) {
  const results = [];
  const deadline = Date.now() + durationMs;
  let active = 0;
  let done = false;

  return new Promise((resolve) => {
    function tick() {
      if (done) return;
      while (active < concurrency && Date.now() < deadline) {
        active++;
        request(url).then((r) => {
          results.push(r);
          active--;
          if (Date.now() >= deadline) {
            done = true;
            const wait = setInterval(() => {
              if (active === 0) {
                clearInterval(wait);
                resolve(results);
              }
            }, 10);
          } else {
            tick();
          }
        });
      }
    }
    tick();
    setTimeout(() => {
      done = true;
    }, durationMs + 5000);
  });
}

async function main() {
  console.log(`\n  nextjs-bench load test`);
  console.log(`  URL         : ${BASE_URL}`);
  console.log(`  Concurrency : ${CONCURRENCY} workers`);
  console.log(`  Warmup      : ${WARMUP_S}s`);
  console.log(`  Duration    : ${DURATION_S}s`);

  process.stdout.write(`\n  Warming up...`);
  await runWorkers(BASE_URL, Math.min(CONCURRENCY, 5), WARMUP_S * 1000);
  console.log(` done.`);

  const scenarios = [
    { label: `SSR /  (concurrency=${CONCURRENCY})`, url: BASE_URL, concurrency: CONCURRENCY },
    { label: `SSR /  (concurrency=1)`, url: BASE_URL, concurrency: 1 },
    {
      label: `GET /api/health (concurrency=${CONCURRENCY})`,
      url: BASE_URL.replace(/\/$/, "") + "/api/health",
      concurrency: CONCURRENCY,
    },
  ];

  for (const s of scenarios) {
    process.stdout.write(`\n  Running: ${s.label} ...`);
    const t0 = Date.now();
    const results = await runWorkers(s.url, s.concurrency, DURATION_S * 1000);
    const elapsed = (Date.now() - t0) / 1000;
    printResults(s.label, results, elapsed);
  }

  console.log(`\n${"─".repeat(60)}\n`);
}

main().catch(console.error);
