import pool from '../infrastructure/persistence/postgres/connection';

async function resetDatabase() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query(`
      DROP TABLE IF EXISTS
        pruebas,
        user_progress,
        volume_starts,
        user_volumes,
        chapters,
        volumes,
        refresh_tokens,
        wallets,
        users,
        migrations
      CASCADE;
    `);
    await client.query('COMMIT');
    console.log('🗑️  All tables dropped successfully.');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Reset failed:', err);
    throw err;
  } finally {
    client.release();
  }
}

async function main() {
  try {
    await resetDatabase();
  } catch (err) {
    console.error(err);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

main();
