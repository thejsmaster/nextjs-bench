import Head from "next/head";

export default function Home() {
  return (
    <>
      <Head>
        <title>Next.js SSR Benchmark</title>
      </Head>

      <div style={{ fontFamily: "system-ui, sans-serif", maxWidth: 640, margin: "4rem auto", padding: "0 1rem", textAlign: "center" }}>
        <h1>Next.js SSR Benchmark</h1>
        <p style={{ color: "#555", fontSize: "1.1rem", lineHeight: 1.6 }}>
          A Next.js SSR benchmark app that mirrors the mates-bench app.
          Same SQLite schema, same data, same 5 queries per SSR request.
        </p>

        <div style={{ marginTop: "2rem" }}>
          <a
            href="/bench"
            style={{
              display: "inline-block",
              padding: "0.75rem 2rem",
              fontSize: "1rem",
              background: "#0066cc",
              color: "white",
              textDecoration: "none",
              borderRadius: 6,
              fontWeight: 600,
            }}
          >
            Run Benchmarks
          </a>
        </div>

        <div style={{ marginTop: "3rem", textAlign: "left", background: "#f5f5f5", padding: "1.5rem", borderRadius: 8, fontSize: "0.9rem" }}>
          <strong>Routes:</strong>
          <ul style={{ marginTop: "0.5rem" }}>
            <li><code>/</code> — This landing page</li>
            <li><code>/bench</code> — Click a button to run SSR benchmarks</li>
            <li><code>/ssr-dashboard</code> — The SSR dashboard (5 SQLite queries)</li>
            <li><code>/api/health</code> — Health check endpoint</li>
          </ul>
        </div>
      </div>
    </>
  );
}
