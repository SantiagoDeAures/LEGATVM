import pool from './connection';
import { Prueba, Question, Option } from '../../../domain/Prueba';
import { PruebaRepository } from '../../../application/ports/PruebaRepository';

export class PostgresPruebaRepository implements PruebaRepository {

  async findByVolumeAndChapter(volumeId: string, chapterId: string): Promise<Prueba | undefined> {
    const { rows } = await pool.query(
      'SELECT * FROM pruebas WHERE volume_id = $1 AND chapter_id = $2',
      [volumeId, chapterId]
    );
    if (rows.length === 0) return undefined;
    return this.toDomain(rows[0]);
  }

  async findById(id: string): Promise<Prueba | undefined> {
    const { rows } = await pool.query('SELECT * FROM pruebas WHERE id = $1', [id]);
    if (rows.length === 0) return undefined;
    return this.toDomain(rows[0]);
  }

  async save(prueba: Prueba): Promise<void> {
    const questionsJson = JSON.stringify(
      prueba.questions.map(q => ({
        id: q.id,
        question: q.question,
        options: q.options.map(o => ({ id: o.id, text: o.text })),
        correctOptionIds: q.correctOptionIds,
      }))
    );

    await pool.query(
      `INSERT INTO pruebas (id, volume_id, chapter_id, questions) VALUES ($1, $2, $3, $4)
       ON CONFLICT (id) DO UPDATE SET volume_id = $2, chapter_id = $3, questions = $4`,
      [prueba.id, prueba.volumeId, prueba.chapterId, questionsJson]
    );
  }

  private toDomain(row: any): Prueba {
    const questions = (row.questions as any[]).map(
      (q: any) =>
        new Question(
          q.id,
          q.question,
          q.options.map((o: any) => new Option(o.id, o.text)),
          q.correctOptionIds,
        ),
    );
    return new Prueba(row.id, row.volume_id, row.chapter_id, questions);
  }
}
