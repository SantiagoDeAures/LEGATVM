import { UserProgress } from '../../domain/UserProgress';

export interface UserProgressRepository {
  findByUserAndChapterIds(userId: string, chapterIds: string[]): Promise<UserProgress[]>;
  save(progress: UserProgress): Promise<void>;
  deleteByUserAndChapterIds(userId: string, chapterIds: string[]): Promise<void>;
}
