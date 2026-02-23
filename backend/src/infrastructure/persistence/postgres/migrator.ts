import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import pool from './connection';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function ensureMigrationsTable(): Promise<void> {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS migrations (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL UNIQUE,
      applied_at TIMESTAMP DEFAULT NOW()
    );
  `);
}

async function getAppliedMigrations(): Promise<string[]> {
  const { rows } = await pool.query('SELECT name FROM migrations ORDER BY id');
  return rows.map((r: { name: string }) => r.name);
}

async function runMigrations(): Promise<void> {
  await ensureMigrationsTable();

  const migrationsDir = path.join(__dirname, 'migrations');
  const files = fs.readdirSync(migrationsDir)
    .filter(f => f.endsWith('.sql'))
    .sort();

  const applied = await getAppliedMigrations();

  for (const file of files) {
    if (applied.includes(file)) {
      console.log(`⏭  Already applied: ${file}`);
      continue;
    }

    const filePath = path.join(migrationsDir, file);
    const sql = fs.readFileSync(filePath, 'utf-8');

    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      await client.query(sql);
      await client.query('INSERT INTO migrations (name) VALUES ($1)', [file]);
      await client.query('COMMIT');
      console.log(`✅ Applied: ${file}`);
    } catch (err) {
      await client.query('ROLLBACK');
      console.error(`❌ Failed: ${file}`, err);
      throw err;
    } finally {
      client.release();
    }
  }

  console.log('🎉 All migrations applied.');
}

export { runMigrations };
