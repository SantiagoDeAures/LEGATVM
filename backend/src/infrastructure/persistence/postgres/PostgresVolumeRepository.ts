import pool from './connection';
import { Volume } from '../../../domain/Volume';
import { VolumeRepository } from '../../../application/ports/VolumeRepository';

export class PostgresVolumeRepository implements VolumeRepository {

  async findAll(): Promise<Volume[]> {
    const { rows } = await pool.query('SELECT * FROM volumes');
    return rows.map(this.toDomain);
  }

  async findById(id: string): Promise<Volume | undefined> {
    const { rows } = await pool.query('SELECT * FROM volumes WHERE id = $1', [id]);
    if (rows.length === 0) return undefined;
    return this.toDomain(rows[0]);
  }

  async findByCategory(category: string): Promise<Volume[]> {
    const { rows } = await pool.query(
      `SELECT * FROM volumes WHERE EXISTS (
        SELECT 1 FROM unnest(categories) AS cat WHERE LOWER(cat) = LOWER($1)
      )`,
      [category]
    );
    return rows.map(this.toDomain);
  }

  async save(volume: Volume): Promise<void> {
    await pool.query(
      `INSERT INTO volumes (id, title, description, categories, price, thumbnail)
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT (id) DO UPDATE SET title = $2, description = $3, categories = $4, price = $5, thumbnail = $6`,
      [volume.id, volume.title, volume.description, volume.categories, volume.price, volume.thumbnail]
    );
  }

  private toDomain(row: any): Volume {
    return new Volume(
      row.id,
      row.title,
      row.description,
      row.categories,
      Number(row.price),
      row.thumbnail
    );
  }
}
