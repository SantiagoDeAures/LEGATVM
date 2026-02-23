import pool from './connection';
import { UserProgress } from '../../../domain/UserProgress';
import { UserProgressRepository } from '../../../application/ports/UserProgressRepository';

export class PostgresUserProgressRepository implements UserProgressRepository {

  async findByUserAndChapterIds(userId: string, chapterIds: string[]): Promise<UserProgress[]> {
    if (chapterIds.length === 0) return [];

    const placeholders = chapterIds.map((_, i) => `$${i + 2}`).join(', ');
    const { rows } = await pool.query(
      `SELECT * FROM user_progress WHERE user_id = $1 AND chapter_id IN (${placeholders})`,
      [userId, ...chapterIds]
    );
    return rows.map((r: any) => new UserProgress(r.user_id, r.chapter_id, r.is_completed));
  }

  async save(progress: UserProgress): Promise<void> {
    await pool.query(
      `INSERT INTO user_progress (user_id, chapter_id, is_completed) VALUES ($1, $2, $3)
       ON CONFLICT (user_id, chapter_id) DO UPDATE SET is_completed = $3`,
      [progress.userId, progress.chapterId, progress.isCompleted]
    );
  }

  async deleteByUserAndChapterIds(userId: string, chapterIds: string[]): Promise<void> {
    if (chapterIds.length === 0) return;

    const placeholders = chapterIds.map((_, i) => `$${i + 2}`).join(', ');
    await pool.query(
      `DELETE FROM user_progress WHERE user_id = $1 AND chapter_id IN (${placeholders})`,
      [userId, ...chapterIds]
    );
  }
}
