import pool from './connection';
import { Chapter } from '../../../domain/Chapter';
import { ChapterRepository } from '../../../application/ports/ChapterRepository';

export class PostgresChapterRepository implements ChapterRepository {

  async findByVolumeId(volumeId: string): Promise<Chapter[]> {
    const { rows } = await pool.query(
      'SELECT * FROM chapters WHERE volume_id = $1 ORDER BY id',
      [volumeId]
    );
    return rows.map(this.toDomain);
  }

  async save(chapter: Chapter): Promise<void> {
    await pool.query(
      `INSERT INTO chapters (id, volume_id, title, type, content_url)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (id) DO UPDATE SET volume_id = $2, title = $3, type = $4, content_url = $5`,
      [chapter.id, chapter.volumeId, chapter.title, chapter.type, chapter.contentUrl]
    );
  }

  private toDomain(row: any): Chapter {
    return new Chapter(
      row.id,
      row.volume_id,
      row.title,
      row.type,
      row.content_url
    );
  }
}
