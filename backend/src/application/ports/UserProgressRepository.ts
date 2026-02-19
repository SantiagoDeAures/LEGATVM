import { UserProgress } from '../../domain/UserProgress';

export interface UserProgressRepository {
  findByUserAndChapterIds(userId: string, chapterIds: string[]): UserProgress[];
  save(progress: UserProgress): void;
}
