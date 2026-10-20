import { describe, expect, test } from "bun:test";
import { validateSQL } from "../validator";

describe("SQL Validator", () => {
  describe("Basic SELECT queries", () => {
    test("valid simple SELECT query", () => {
      const sql = "SELECT * FROM users;";
      const result = validateSQL(sql);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
      expect(result.formattedSQL).toBeDefined();
      // Valid, but the editor advises against both of these on purpose (checkPerformanceIssues).
      expect(result.warnings.map((w) => w.message)).toEqual([
        expect.stringContaining("SELECT *"),
        expect.stringContaining("without LIMIT"),
      ]);
    });

    test("a query with named columns and a LIMIT has no warnings", () => {
      const result = validateSQL("SELECT id, name FROM users LIMIT 10;");

      expect(result.isValid).toBe(true);
      expect(result.warnings).toHaveLength(0);
    });

    test("valid SELECT with specific columns", () => {
      const sql = "SELECT id, name, email FROM users;";
      const result = validateSQL(sql);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test("valid SELECT with WHERE clause", () => {
      const sql = "SELECT * FROM users WHERE id = 1;";
      const result = validateSQL(sql);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test("valid SELECT with JOIN", () => {
      const sql = "SELECT u.*, o.* FROM users u JOIN orders o ON u.id = o.user_id;";
      const result = validateSQL(sql);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test("valid SELECT with GROUP BY", () => {
      const sql = "SELECT status, COUNT(*) FROM orders GROUP BY status;";
      const result = validateSQL(sql);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test("valid SELECT with ORDER BY", () => {
      const sql = "SELECT * FROM users ORDER BY name DESC;";
      const result = validateSQL(sql);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test("valid SELECT with LIMIT", () => {
      const sql = "SELECT * FROM users LIMIT 10;";
      const result = validateSQL(sql);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  });

  describe("Complex queries", () => {
    test("valid query with multiple JOINs", () => {
      const sql = `
        SELECT u.name, o.id, p.name as product_name
        FROM users u
        JOIN orders o ON u.id = o.user_id
        JOIN order_items oi ON o.id = oi.order_id
        JOIN products p ON oi.product_id = p.id;
      `;
      const result = validateSQL(sql);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test("valid query with subquery", () => {
      const sql = `
        SELECT * FROM users
        WHERE id IN (SELECT user_id FROM orders WHERE total_amount > 100);
      `;
      const result = validateSQL(sql);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test("valid query with CTE (WITH clause)", () => {
      const sql = `
        WITH customer_orders AS (
          SELECT user_id, COUNT(*) as order_count
          FROM orders
          GROUP BY user_id
        )
        SELECT u.name, co.order_count
        FROM users u
        JOIN customer_orders co ON u.id = co.user_id;
      `;
      const result = validateSQL(sql);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test("valid query with CASE statement", () => {
      const sql = `
        SELECT name,
          CASE
            WHEN email LIKE '%@admin.com' THEN 'Admin'
            WHEN email LIKE '%@test.com' THEN 'Tester'
            ELSE 'User'
          END as user_type
        FROM users;
      `;
      const result = validateSQL(sql);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test("valid query with aggregations", () => {
      const sql = `
        SELECT
          status,
          COUNT(*) as count,
          SUM(total_amount) as total,
          AVG(total_amount) as average,
          MIN(total_amount) as minimum,
          MAX(total_amount) as maximum
        FROM orders
        GROUP BY status;
      `;
      const result = validateSQL(sql);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  });

  describe("Error handling", () => {
    test("invalid SQL syntax", () => {
      const sql = "SELCT * FROM users;"; // typo in SELECT
      const result = validateSQL(sql);

      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    test("missing FROM clause", () => {
      const sql = "SELECT * WHERE id = 1;";
      const result = validateSQL(sql);

      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    test("unbalanced parentheses", () => {
      const sql = "SELECT * FROM users WHERE (id = 1;";
      const result = validateSQL(sql);

      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    test("empty query", () => {
      const sql = "";
      const result = validateSQL(sql);

      expect(result.isValid).toBe(false);
      expect(result.errors[0].message).toBe("Query is empty");
    });

    test("a query of only whitespace, a comment or a semicolon is empty", () => {
      for (const sql of ["   \n\t ", ";", "-- just a comment"]) {
        const result = validateSQL(sql);
        expect(result.isValid).toBe(false);
        expect(result.errors[0].message).toBe("Query is empty");
      }
    });

    test("SELECT t.* with no FROM is invalid, in a subquery too", () => {
      for (const sql of [
        "SELECT t.* WHERE id = 1",
        "SELECT * FROM (SELECT * WHERE 1 = 1) s",
        "SELECT * FROM a; SELECT * WHERE x = 1",
      ]) {
        const result = validateSQL(sql);
        expect(result.isValid).toBe(false);
        expect(result.errors[0].message).toBe("SELECT * requires a FROM clause");
      }
    });

    test("a select list without a star needs no FROM", () => {
      for (const sql of ["SELECT 1", "SELECT COUNT(*) WHERE 1 = 1", "SELECT now()"]) {
        expect(validateSQL(sql).isValid).toBe(true);
      }
    });
  });

  describe("Dialect support", () => {
    test("PostgreSQL dialect", () => {
      const sql = "SELECT * FROM users LIMIT 10;";
      const result = validateSQL(sql, "pg");

      expect(result.isValid).toBe(true);
    });

    test("MySQL dialect", () => {
      const sql = "SELECT * FROM users LIMIT 10;";
      const result = validateSQL(sql, "mysql");

      expect(result.isValid).toBe(true);
    });

    test("SQLite dialect", () => {
      const sql = "SELECT * FROM users LIMIT 10;";
      const result = validateSQL(sql, "sqlite3");

      expect(result.isValid).toBe(true);
    });
  });

  describe("SQL Formatting", () => {
    test("formats unformatted SQL", () => {
      const sql = "select id,name from users where id=1;";
      const result = validateSQL(sql);

      expect(result.isValid).toBe(true);
      expect(result.formattedSQL).toBeDefined();
      expect(result.formattedSQL).not.toEqual(sql);
    });

    test("formats complex query", () => {
      const sql =
        "select u.name,o.id from users u join orders o on u.id=o.user_id where o.total_amount>100 order by u.name;";
      const result = validateSQL(sql);

      expect(result.isValid).toBe(true);
      expect(result.formattedSQL).toBeDefined();
    });
  });

  describe("Edge cases", () => {
    test("query with only comments", () => {
      const sql = "-- This is a comment\nSELECT * FROM users;";
      const result = validateSQL(sql);

      expect(result.isValid).toBe(true);
    });

    test("query with trailing semicolon", () => {
      const sql = "SELECT * FROM users;";
      const result = validateSQL(sql);

      expect(result.isValid).toBe(true);
    });

    test("query without trailing semicolon", () => {
      const sql = "SELECT * FROM users";
      const result = validateSQL(sql);

      expect(result.isValid).toBe(true);
    });

    test("query with newlines", () => {
      const sql = "SELECT *\nFROM\nusers\nWHERE\nid = 1;";
      const result = validateSQL(sql);

      expect(result.isValid).toBe(true);
    });
  });
});
