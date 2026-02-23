import pool from './connection';
import { VolumeStartRepository } from '../../../application/ports/VolumeStartRepository';

export class PostgresVolumeStartRepository implements VolumeStartRepository {

  async hasStarted(userId: string, volumeId: string): Promise<boolean> {
    const { rows } = await pool.query(
      'SELECT 1 FROM volume_starts WHERE user_id = $1 AND volume_id = $2',
      [userId, volumeId]
    );
    return rows.length > 0;
  }

  async markStarted(userId: string, volumeId: string): Promise<void> {
    await pool.query(
      'INSERT INTO volume_starts (user_id, volume_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
      [userId, volumeId]
    );
  }

  async markUnstarted(userId: string, volumeId: string): Promise<void> {
    await pool.query(
      'DELETE FROM volume_starts WHERE user_id = $1 AND volume_id = $2',
      [userId, volumeId]
    );
  }
}
