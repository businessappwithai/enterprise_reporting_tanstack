/**
 * Apache AGE client — thin wrapper around `pg` for Cypher graph queries.
 *
 * AGE is a PostgreSQL extension; queries go over the same `pg` Pool that
 * other PostgreSQL work uses.  Two steps are needed per connection:
 *   LOAD 'age'
 *   SET search_path = ag_catalog, "$user", public
 * We do both in the pool `connect` event so every connection is ready.
 *
 * Cypher parameters are passed as a jsonb literal (third arg to cypher()).
 * SQL-level $1 parameterisation keeps the JSON safe against injection.
 */

import { Pool, type PoolClient } from "pg";

const GRAPH_DATABASE_URL =
  process.env.GRAPH_DATABASE_URL ?? "postgresql://graph:graphpass@localhost:5433/ers_knowledge";

export const GRAPH_NAME = "knowledge_graph";

let _pool: Pool | null = null;

function getPool(): Pool {
  if (_pool) return _pool;
  _pool = new Pool({ connectionString: GRAPH_DATABASE_URL, max: 10 });
  _pool.on("connect", (client) => {
    client.query(`LOAD 'age'; SET search_path = ag_catalog, "$user", public;`).catch(() => {});
  });
  return _pool;
}

export interface CypherRow {
  [alias: string]: unknown;
}

/**
 * Run a Cypher query against `knowledge_graph`.
 *
 * @param cypher  - Cypher string; use $paramName syntax for variables.
 * @param params  - Variables injected into the Cypher as a JSON object.
 * @param aliases - Column aliases declared in the AS (...) clause.
 *                  Each string becomes one `agtype` column.
 */
export async function cypher(
  cql: string,
  params: Record<string, unknown> = {},
  aliases: string[] = [],
): Promise<CypherRow[]> {
  const pool = getPool();
  const client: PoolClient = await pool.connect();
  try {
    await client.query(`LOAD 'age'; SET search_path = ag_catalog, "$user", public;`);

    const asCols =
      aliases.length > 0 ? aliases.map((a) => `${a} agtype`).join(", ") : "result agtype";

    const sql = `SELECT * FROM cypher('${GRAPH_NAME}', $$ ${cql} $$, $1::jsonb) AS (${asCols})`;
    const result = await client.query(sql, [JSON.stringify(params)]);

    return result.rows as CypherRow[];
  } finally {
    client.release();
  }
}

/**
 * Run a Cypher query that returns no rows (CREATE / MERGE / DELETE).
 */
export async function cypherWrite(
  cql: string,
  params: Record<string, unknown> = {},
): Promise<void> {
  await cypher(cql, params, []);
}

/**
 * Run raw PostgreSQL SQL against the graph database (for extension setup,
 * graph creation, and DDL that isn't expressible in Cypher).
 */
export async function graphSql(sql: string, values: unknown[] = []): Promise<import("pg").QueryResult> {
  const pool = getPool();
  const client = await pool.connect();
  try {
    await client.query(`LOAD 'age'; SET search_path = ag_catalog, "$user", public;`);
    return await client.query(sql, values);
  } finally {
    client.release();
  }
}
