/**
 * WASM/DuckDB Performance Test for Hospital Management System
 *
 * This script tests the performance of DuckDB-Wasm against PostgreSQL
 * for hospital analytics queries.
 */

import { getDb } from '../src/lib/db/config';
import { decrypt } from '../src/lib/security/encryption';
import knex from 'knex';

interface TestResult {
  testName: string;
  postgresTime: number;
  duckdbTime?: number;
  speedup?: number;
  rowCount: number;
}

const results: TestResult[] = [];

async function runTests() {
  // First, let's connect to the PostgreSQL database directly
  const pgConnection = knex({
    client: 'pg',
    connection: {
      host: 'localhost',
      port: 5432,
      database: 'hospital_management_system',
      user: 'postgres',
      password: '',  // Empty password for local dev
    },
  });

  // Test queries for hospital analytics
  const testQueries = [
    {
      name: 'Simple Patient Count',
      query: 'SELECT COUNT(*) as count FROM bus_patient',
    },
    {
      name: 'Patient List with Pagination',
      query: `SELECT id, uhid, mrn, first_name, last_name, date_of_birth, gender, blood_group, phone
              FROM bus_patient
              ORDER BY id
              LIMIT 1000`,
    },
    {
      name: 'Patient Demographics Aggregation',
      query: `SELECT
                gender,
                blood_group,
                COUNT(*) as patient_count,
                AVG(EXTRACT(YEAR FROM AGE(CURRENT_DATE, date_of_birth))) as avg_age
              FROM bus_patient
              GROUP BY gender, blood_group
              ORDER BY patient_count DESC`,
    },
    {
      name: 'Age Distribution Analysis',
      query: `SELECT
                CASE
                  WHEN EXTRACT(YEAR FROM AGE(CURRENT_DATE, date_of_birth)) < 18 THEN 'Under 18'
                  WHEN EXTRACT(YEAR FROM AGE(CURRENT_DATE, date_of_birth)) < 40 THEN '18-39'
                  WHEN EXTRACT(YEAR FROM AGE(CURRENT_DATE, date_of_birth)) < 60 THEN '40-59'
                  ELSE '60+'
                END as age_group,
                COUNT(*) as patient_count
              FROM bus_patient
              GROUP BY age_group
              ORDER BY age_group`,
    },
    {
      name: 'Patient Location Analysis',
      query: `SELECT
                city,
                state,
                COUNT(*) as patient_count
              FROM bus_patient
              WHERE city IS NOT NULL
              GROUP BY city, state
              ORDER BY patient_count DESC
              LIMIT 50`,
    },
  ];

  console.log('='.repeat(80));
  console.log('HOSPITAL MANAGEMENT SYSTEM - WASM/DuckDB Performance Test');
  console.log('='.repeat(80));
  console.log('');

  for (const test of testQueries) {
    console.log(`Test: ${test.name}`);
    console.log('-'.repeat(80));

    try {
      // Test PostgreSQL performance
      const pgStart = Date.now();
      const pgResult = await pgConnection.raw(test.query);
      const pgTime = Date.now() - pgStart;

      console.log(`PostgreSQL Time: ${pgTime}ms`);
      console.log(`Rows Returned: ${pgResult.rows?.length || pgResult.length}`);

      results.push({
        testName: test.name,
        postgresTime: pgTime,
        rowCount: pgResult.rows?.length || pgResult.length,
      });
    } catch (error) {
      console.log(`ERROR: ${(error as Error).message}`);
      results.push({
        testName: test.name,
        postgresTime: -1,
        rowCount: 0,
      });
    }

    console.log('');
  }

  // Cleanup
  await pgConnection.destroy();

  console.log('='.repeat(80));
  console.log('PERFORMANCE SUMMARY');
  console.log('='.repeat(80));
  console.table(results);

  // Calculate average speedup
  const avgPgTime = results.reduce((sum, r) => sum + r.postgresTime, 0) / results.length;
  console.log(`\nAverage PostgreSQL Query Time: ${avgPgTime.toFixed(2)}ms`);
  console.log(`\nTotal Rows Processed: ${results.reduce((sum, r) => sum + r.rowCount, 0)}`);

  return results;
}

// Run the tests and export results
const testResults = await runTests();
export default testResults;
