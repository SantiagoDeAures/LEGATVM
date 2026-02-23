import { runMigrations } from '../infrastructure/persistence/postgres/migrator';
import pool from '../infrastructure/persistence/postgres/connection';

async function main() {
  try {
    await runMigrations();
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

main();
