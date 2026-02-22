import { Chapter } from '../../domain/Chapter';

export interface ChapterRepository {
  findByVolumeId(volumeId: string): Chapter[];
  save(chapter: Chapter): void 
}
