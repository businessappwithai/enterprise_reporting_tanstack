/**
 * Report simulator — drives N report runs against one running Enterprise
 * Reporting installation over its public HTTP API and records the latency of
 * every run. The same script targets the TanStack Start (Node) backend and the
 * Loco.rs backend, because both serve the same /api surface.
 *
 *   bun scripts/perf/report-simulator.ts \
 *     --base http://localhost:3000 --label tanstack \
 *     --email admin@admin.com --password … \
 *     --target postgresql://enterprise:password@localhost:5432/perf_target \
 *     --runs 200 --concurrency 10 --out ./perf-results
 *
 * Setup is idempotent by name: the data source, the ten saved queries and the
 * ten report definitions are created on the first run and reused after.
 *
 * Each "simulated report" is one run of one of the ten report definitions
 * over the target entity, in one of four shapes, in a fixed mix:
 *   data (paged JSON, what the report viewer loads) 50%, CSV 20%, XLSX 15%, PDF 15%
 * The run list is deterministic, so both backends receive the identical workload.
 */

type Kind = "data" | "csv" | "xlsx" | "pdf";

interface RunResult {
  phase: string;
  index: number;
  report: string;
  kind: Kind;
  status: number;
  ms: number;
  bytes: number;
  rows?: number;
  totalRows?: number;
  error?: string;
}

const args = new Map<string, string>();
for (let i = 2; i < process.argv.length; i += 2) {
  args.set(process.argv[i].replace(/^--/, ""), process.argv[i + 1]);
}
const base = (args.get("base") ?? "http://localhost:3000").replace(/\/$/, "");
const label = args.get("label") ?? new URL(base).host;
const email = args.get("email") ?? "admin@admin.com";
const password = args.get("password") ?? process.env.ADMIN_PASSWORD ?? "";
const target = new URL(
  args.get("target") ?? "postgresql://enterprise:password@localhost:5432/perf_target"
);
const runs = Number(args.get("runs") ?? 200);
const concurrency = Number(args.get("concurrency") ?? 10);
const outDir = args.get("out") ?? "./perf-results";
// Origin for Better Auth's CSRF check; defaults to the base URL.
const authOrigin = args.get("origin") ?? base;

const REPORTS: { name: string; sql: string }[] = [
  { name: "All sales orders", sql: "SELECT * FROM sales_orders ORDER BY id" },
  {
    name: "Revenue by region",
    sql: "SELECT region, COUNT(*) AS orders, SUM(quantity) AS units, SUM(amount) AS revenue FROM sales_orders GROUP BY region ORDER BY revenue DESC",
  },
  {
    name: "Revenue by product",
    sql: "SELECT product, category, COUNT(*) AS orders, SUM(amount) AS revenue, AVG(amount) AS avg_order FROM sales_orders GROUP BY product, category ORDER BY revenue DESC",
  },
  {
    name: "Orders by status",
    sql: "SELECT status, COUNT(*) AS orders, SUM(amount) AS revenue FROM sales_orders GROUP BY status ORDER BY orders DESC",
  },
  {
    name: "Monthly revenue trend",
    sql: "SELECT to_char(date_trunc('month', order_date), 'YYYY-MM') AS month, COUNT(*) AS orders, SUM(amount) AS revenue FROM sales_orders GROUP BY 1 ORDER BY 1",
  },
  {
    name: "Top 100 orders by amount",
    sql: "SELECT order_number, customer, product, quantity, amount, status, order_date FROM sales_orders ORDER BY amount DESC LIMIT 100",
  },
  {
    name: "Customer revenue",
    sql: "SELECT customer, region, COUNT(*) AS orders, SUM(amount) AS revenue FROM sales_orders GROUP BY customer, region ORDER BY revenue DESC",
  },
  {
    name: "Delivered orders",
    sql: "SELECT order_number, customer, region, product, amount, order_date FROM sales_orders WHERE status = 'delivered' ORDER BY order_date DESC",
  },
  {
    name: "Category x region matrix",
    sql: "SELECT category, region, SUM(amount) AS revenue, SUM(quantity) AS units FROM sales_orders GROUP BY category, region ORDER BY category, region",
  },
  {
    name: "Returns and cancellations",
    sql: "SELECT order_number, customer, product, amount, status, order_date FROM sales_orders WHERE status IN ('returned', 'cancelled') ORDER BY amount DESC",
  },
];
const PREFIX = "[perf] ";

let cookie = "";

async function call(path: string, init: RequestInit = {}): Promise<Response> {
  const headers = new Headers(init.headers);
  if (cookie) headers.set("cookie", cookie);
  headers.set("origin", authOrigin);
  if (init.body && !headers.has("content-type")) headers.set("content-type", "application/json");
  return fetch(`${base}${path}`, { ...init, headers, redirect: "manual" });
}

async function jsonOf(res: Response): Promise<any> {
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    throw new Error(`${res.status} non-JSON response: ${text.slice(0, 200)}`);
  }
}

async function signIn() {
  const res = await call("/api/auth/sign-in/email", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error(`sign-in failed: ${res.status} ${await res.text()}`);
  const setCookies = res.headers.getSetCookie();
  cookie = setCookies.map((c) => c.split(";")[0]).join("; ");
  if (!cookie) throw new Error("sign-in returned no cookie");
}

/** Pull a list out of whichever envelope an endpoint uses. */
function listOf(body: any): any[] {
  const candidates = [
    body?.data?.items,
    body?.items,
    body?.data,
    body?.dataSources,
    body?.queries,
    body?.reports,
  ];
  for (const c of candidates) if (Array.isArray(c)) return c;
  return [];
}

async function ensureDataSource(): Promise<string> {
  const name = `${PREFIX}sales_orders target`;
  const list = listOf(await jsonOf(await call("/api/data-sources?pageSize=100")));
  const existing = list.find((d) => d.name === name);
  if (existing) return existing.id;
  const res = await call("/api/data-sources", {
    method: "POST",
    body: JSON.stringify({
      name,
      description: "1000-row sales_orders entity used by the report simulator",
      clientType: "pg",
      connectionConfig: {
        host: target.hostname,
        port: Number(target.port || 5432),
        database: target.pathname.replace(/^\//, ""),
        user: decodeURIComponent(target.username),
        password: decodeURIComponent(target.password),
        ssl: false,
      },
    }),
  });
  const body = await jsonOf(res);
  const id = body?.item?.id ?? body?.data?.id ?? body?.id;
  if (!id) throw new Error(`data source create failed: ${res.status} ${JSON.stringify(body)}`);
  return id;
}

async function ensureReports(dataSourceId: string): Promise<{ id: string; name: string }[]> {
  const queries = listOf(
    await jsonOf(
      await call(`/api/queries?pageSize=100&search=${encodeURIComponent(PREFIX.trim())}`)
    )
  );
  const reports = listOf(await jsonOf(await call("/api/reports?pageSize=100")));
  const out: { id: string; name: string }[] = [];
  for (const r of REPORTS) {
    const qName = `${PREFIX}${r.name}`;
    let q = queries.find((x) => x.name === qName);
    if (!q) {
      const res = await call("/api/queries", {
        method: "POST",
        body: JSON.stringify({ name: qName, dataSourceId, sqlContent: r.sql }),
      });
      const body = await jsonOf(res);
      q = body?.data ?? body?.item ?? body;
      if (!q?.id) throw new Error(`query create failed: ${res.status} ${JSON.stringify(body)}`);
    }
    let rep = reports.find((x) => x.name === qName);
    if (!rep) {
      const res = await call("/api/reports", {
        method: "POST",
        body: JSON.stringify({
          name: qName,
          description: `Simulator report: ${r.name}`,
          savedQueryId: q.id,
          exportFormats: ["csv", "xlsx", "pdf"],
        }),
      });
      const body = await jsonOf(res);
      rep = body?.data ?? body?.item ?? body;
      if (!rep?.id) throw new Error(`report create failed: ${res.status} ${JSON.stringify(body)}`);
    }
    out.push({ id: rep.id, name: r.name });
  }
  return out;
}

/** Deterministic mix: 10 of every 20 runs are data, 4 CSV, 3 XLSX, 3 PDF. */
const MIX: Kind[] = [
  "data",
  "csv",
  "data",
  "xlsx",
  "data",
  "pdf",
  "data",
  "csv",
  "data",
  "data",
  "xlsx",
  "data",
  "csv",
  "data",
  "pdf",
  "data",
  "csv",
  "xlsx",
  "data",
  "pdf",
];

function plan(reports: { id: string; name: string }[], n: number) {
  return Array.from({ length: n }, (_, i) => ({
    index: i,
    report: reports[i % reports.length],
    kind: MIX[i % MIX.length],
    page: Math.floor(i / reports.length) % 5,
  }));
}

async function runOne(phase: string, p: ReturnType<typeof plan>[number]): Promise<RunResult> {
  const t0 = performance.now();
  try {
    let res: Response;
    if (p.kind === "data") {
      res = await call(`/api/reports/${p.report.id}/data?page=${p.page}&pageSize=50`);
    } else {
      res = await call(`/api/reports/${p.report.id}/export`, {
        method: "POST",
        body: JSON.stringify({ format: p.kind }),
      });
    }
    const buf = new Uint8Array(await res.arrayBuffer());
    const ms = performance.now() - t0;
    const r: RunResult = {
      phase,
      index: p.index,
      report: p.report.name,
      kind: p.kind,
      status: res.status,
      ms,
      bytes: buf.length,
    };
    if (p.kind === "data") {
      try {
        const body = JSON.parse(new TextDecoder().decode(buf));
        r.rows = body?.data?.rows?.length;
        r.totalRows = body?.data?.totalRows;
        if (!body?.success) r.error = body?.error?.message;
      } catch {
        r.error = "non-JSON";
      }
    } else if (!res.ok) {
      r.error = new TextDecoder().decode(buf).slice(0, 200);
    }
    return r;
  } catch (e) {
    return {
      phase,
      index: p.index,
      report: p.report.name,
      kind: p.kind,
      status: 0,
      ms: performance.now() - t0,
      bytes: 0,
      error: String(e),
    };
  }
}

async function runPhase(phase: string, items: ReturnType<typeof plan>, c: number) {
  const results: RunResult[] = [];
  let next = 0;
  const t0 = performance.now();
  await Promise.all(
    Array.from({ length: c }, async () => {
      while (next < items.length) {
        const p = items[next++];
        results.push(await runOne(phase, p));
      }
    })
  );
  return { results: results.sort((a, b) => a.index - b.index), wallMs: performance.now() - t0 };
}

function pct(sorted: number[], p: number) {
  if (!sorted.length) return 0;
  return sorted[Math.min(sorted.length - 1, Math.ceil((p / 100) * sorted.length) - 1)];
}

function summarise(results: RunResult[], wallMs: number) {
  const ok = results.filter((r) => r.status >= 200 && r.status < 300 && !r.error);
  const ms = ok.map((r) => r.ms).sort((a, b) => a - b);
  const byKind: Record<string, any> = {};
  for (const k of ["data", "csv", "xlsx", "pdf"] as Kind[]) {
    const s = ok
      .filter((r) => r.kind === k)
      .map((r) => r.ms)
      .sort((a, b) => a - b);
    byKind[k] = {
      n: s.length,
      mean: s.length ? s.reduce((a, b) => a + b, 0) / s.length : 0,
      p50: pct(s, 50),
      p95: pct(s, 95),
    };
  }
  return {
    runs: results.length,
    ok: ok.length,
    failed: results.length - ok.length,
    wallMs,
    throughput: (results.length / wallMs) * 1000,
    mean: ms.length ? ms.reduce((a, b) => a + b, 0) / ms.length : 0,
    p50: pct(ms, 50),
    p90: pct(ms, 90),
    p95: pct(ms, 95),
    p99: pct(ms, 99),
    max: ms[ms.length - 1] ?? 0,
    min: ms[0] ?? 0,
    byKind,
  };
}

async function main() {
  const { mkdirSync, writeFileSync } = await import("node:fs");
  mkdirSync(outDir, { recursive: true });
  console.log(`[${label}] ${base} — signing in as ${email}`);
  await signIn();
  const dsId = await ensureDataSource();
  const reports = await ensureReports(dsId);
  console.log(`[${label}] data source ${dsId}, ${reports.length} report definitions`);

  // Warm-up: one data run and one CSV per report, not counted.
  await runPhase(
    "warmup",
    plan(reports, reports.length * 2).map((p, i) => ({ ...p, kind: i % 2 ? "csv" : "data" })),
    1
  );

  const items = plan(reports, runs);
  const seq = await runPhase("sequential", items, 1);
  const con = await runPhase(`concurrent-${concurrency}`, items, concurrency);

  const summary = {
    label,
    base,
    date: new Date().toISOString(),
    runsPerPhase: runs,
    concurrency,
    sequential: summarise(seq.results, seq.wallMs),
    concurrent: summarise(con.results, con.wallMs),
    failures: [...seq.results, ...con.results]
      .filter((r) => r.error || r.status >= 300)
      .slice(0, 20),
    // Row counts per report, for cross-backend correctness comparison.
    rowCounts: Object.fromEntries(
      seq.results
        .filter((r) => r.kind === "data" && r.totalRows !== undefined)
        .map((r) => [r.report, r.totalRows])
    ),
  };
  writeFileSync(
    `${outDir}/${label}-runs.json`,
    JSON.stringify([...seq.results, ...con.results], null, 2)
  );
  writeFileSync(`${outDir}/${label}-summary.json`, JSON.stringify(summary, null, 2));
  const f = (n: number) => n.toFixed(1).padStart(8);
  for (const [name, s] of [
    ["sequential", summary.sequential],
    [`concurrent x${concurrency}`, summary.concurrent],
  ] as const) {
    console.log(
      `[${label}] ${name.padEnd(14)} ok ${s.ok}/${s.runs}  mean${f(s.mean)}ms  p50${f(s.p50)}  p95${f(s.p95)}  p99${f(s.p99)}  max${f(s.max)}  ${s.throughput.toFixed(1)} runs/s`
    );
  }
  if (summary.failures.length)
    console.log(`[${label}] first failures:`, summary.failures.slice(0, 3));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
