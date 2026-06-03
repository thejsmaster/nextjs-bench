import { useState } from "react";
import Head from "next/head";

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

export default function BenchPage() {
  const [results, setResults] = useState<BenchResult[] | null>(null);
  const [serverInfo, setServerInfo] = useState<ServerInfo | null>(null);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const run = async () => {
    setRunning(true);
    setError(null);
    setResults(null);
    setServerInfo(null);
    try {
      const res = await fetch("/api/run-benchmarks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ iterations: 30 }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}: ${await res.text()}`);
      const data = await res.json();
      setResults(data.results);
      setServerInfo(data.serverInfo);
    } catch (e: any) {
      setError(e?.message ?? String(e));
    }
    setRunning(false);
  };

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", maxWidth: 800, margin: "2rem auto", padding: "0 1rem" }}>
      <Head>
        <title>SSR Benchmark — Next.js</title>
      </Head>

      <h1>SSR Benchmark</h1>
      <p>Runs SSR renders with SQLite queries and measures end-to-end time.</p>

      <button
        onClick={run}
        disabled={running}
        style={{
          padding: "0.75rem 2rem",
          fontSize: "1rem",
          background: "#0066cc",
          color: "white",
          border: "none",
          borderRadius: 6,
          cursor: "pointer",
          opacity: running ? 0.6 : 1,
        }}
      >
        {running ? "Running..." : "Run Benchmarks"}
      </button>

      {error && (
        <div style={{ marginTop: "1rem", padding: "1rem", background: "#fee", borderRadius: 6, color: "#c00" }}>
          Error: {error}
        </div>
      )}

      {serverInfo && (
        <div style={{ marginTop: "1rem", padding: "0.75rem", background: "#f5f5f5", borderRadius: 6, fontSize: "0.85rem" }}>
          <strong>Server:</strong>{" "}
          Next.js · Node {serverInfo.node} · {serverInfo.cpuCount} CPUs · {serverInfo.memory} RAM · {serverInfo.platform}
        </div>
      )}

      {results && (
        <table style={{ marginTop: "1.5rem", width: "100%", borderCollapse: "collapse", background: "white", borderRadius: 8, overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
          <thead>
            <tr style={{ background: "#fafafa" }}>
              <th style={{ padding: "0.75rem 1rem", textAlign: "left", borderBottom: "2px solid #eee" }}>Benchmark</th>
              <th style={{ padding: "0.75rem 1rem", textAlign: "right", borderBottom: "2px solid #eee" }}>Runs</th>
              <th style={{ padding: "0.75rem 1rem", textAlign: "right", borderBottom: "2px solid #eee" }}>Avg (ms)</th>
              <th style={{ padding: "0.75rem 1rem", textAlign: "right", borderBottom: "2px solid #eee" }}>Min (ms)</th>
              <th style={{ padding: "0.75rem 1rem", textAlign: "right", borderBottom: "2px solid #eee" }}>Max (ms)</th>
              <th style={{ padding: "0.75rem 1rem", textAlign: "right", borderBottom: "2px solid #eee" }}>Ops/s</th>
            </tr>
          </thead>
          <tbody>
            {results.map((r, i) => (
              <tr key={i}>
                <td style={{ padding: "0.75rem 1rem", borderBottom: "1px solid #eee" }}>{r.name}</td>
                <td style={{ padding: "0.75rem 1rem", textAlign: "right", borderBottom: "1px solid #eee" }}>{r.iterations}</td>
                <td style={{ padding: "0.75rem 1rem", textAlign: "right", borderBottom: "1px solid #eee", fontWeight: "bold" }}>{r.avgMs}</td>
                <td style={{ padding: "0.75rem 1rem", textAlign: "right", borderBottom: "1px solid #eee" }}>{r.minMs}</td>
                <td style={{ padding: "0.75rem 1rem", textAlign: "right", borderBottom: "1px solid #eee" }}>{r.maxMs}</td>
                <td style={{ padding: "0.75rem 1rem", textAlign: "right", borderBottom: "1px solid #eee", fontWeight: "bold" }}>{r.ops}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <p style={{ marginTop: "1rem", fontSize: "0.85rem", color: "#888" }}>
        Benchmarks run server-side via <code>getServerSideProps</code>. Results include SQLite query time + React SSR + network overhead of localhost HTTP.
      </p>
    </div>
  );
}
