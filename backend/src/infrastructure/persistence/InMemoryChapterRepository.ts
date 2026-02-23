import { Chapter } from '../../domain/Chapter.js';
import { ChapterRepository } from '../../application/ports/ChapterRepository.js';

export class InMemoryChapterRepository implements ChapterRepository {
  private chapters: Chapter[] = [];

  async findByVolumeId(volumeId: string): Promise<Chapter[]> {
    return this.chapters.filter((c) => c.volumeId === volumeId);
  }

  async save(chapter: Chapter): Promise<void> {
    this.chapters.push(chapter);
  }
}
