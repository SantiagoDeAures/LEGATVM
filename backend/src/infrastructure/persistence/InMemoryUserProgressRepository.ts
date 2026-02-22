import { UserProgress } from '../../domain/UserProgress';
import { UserProgressRepository } from '../../application/ports/UserProgressRepository';

export class InMemoryUserProgressRepository implements UserProgressRepository {
  private records: UserProgress[] = [];

  findByUserAndChapterIds(userId: string, chapterIds: string[]): UserProgress[] {
    return this.records.filter(
      (r) => r.userId === userId && chapterIds.includes(r.chapterId),
    );
  }

  save(progress: UserProgress): void {
    this.records.push(progress);
  }

  deleteByUserAndChapterIds(userId: string, chapterIds: string[]): void {
    this.records = this.records.filter(
      (r) => !(r.userId === userId && chapterIds.includes(r.chapterId)),
    );
  }
}
