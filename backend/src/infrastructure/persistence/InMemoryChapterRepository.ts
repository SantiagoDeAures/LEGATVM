import { Chapter } from '../../domain/Chapter';
import { ChapterRepository } from '../../application/ports/ChapterRepository';

export class InMemoryChapterRepository implements ChapterRepository {
  private chapters: Chapter[] = [];

  findByVolumeId(volumeId: string): Chapter[] {
    return this.chapters.filter((c) => c.volumeId === volumeId);
  }

  save(chapter: Chapter): void {
    this.chapters.push(chapter);
  }
}
