import { UserProgress } from '../../domain/UserProgress.js';
import { UserProgressRepository } from '../../application/ports/UserProgressRepository.js';

export class InMemoryUserProgressRepository implements UserProgressRepository {
  private records: UserProgress[] = [];

  async findByUserAndChapterIds(userId: string, chapterIds: string[]): Promise<UserProgress[]> {
    return this.records.filter(
      (r) => r.userId === userId && chapterIds.includes(r.chapterId),
    );
  }

  async save(progress: UserProgress): Promise<void> {
    this.records.push(progress);
  }

  async deleteByUserAndChapterIds(userId: string, chapterIds: string[]): Promise<void> {
    this.records = this.records.filter(
      (r) => !(r.userId === userId && chapterIds.includes(r.chapterId)),
    );
  }
}
