import { Chapter } from '../../domain/Chapter';

export interface ChapterRepository {
  findByVolumeId(volumeId: string): Chapter[];
}
