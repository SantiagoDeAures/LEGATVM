import { Chapter } from '../../domain/Chapter';

export interface ChapterRepository {
  findByVolumeId(volumeId: string): Promise<Chapter[]>;
  save(chapter: Chapter): Promise<void>;
}
