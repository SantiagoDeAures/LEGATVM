import pool from './connection';
import { UserVolumeRepository } from '../../../application/ports/UserVolumeRepository';

export class PostgresUserVolumeRepository implements UserVolumeRepository {

  async findVolumeIdsByUserId(userId: string): Promise<string[]> {
    const { rows } = await pool.query(
      'SELECT volume_id FROM user_volumes WHERE user_id = $1',
      [userId]
    );
    return rows.map((r: any) => r.volume_id);
  }

  async hasVolume(userId: string, volumeId: string): Promise<boolean> {
    const { rows } = await pool.query(
      'SELECT 1 FROM user_volumes WHERE user_id = $1 AND volume_id = $2',
      [userId, volumeId]
    );
    return rows.length > 0;
  }

  async save(userId: string, volumeId: string): Promise<void> {
    await pool.query(
      'INSERT INTO user_volumes (user_id, volume_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
      [userId, volumeId]
    );
  }
}
