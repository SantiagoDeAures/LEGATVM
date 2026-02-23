import { ChapterRepository } from '../ports/ChapterRepository';
import { VolumeRepository } from '../ports/VolumeRepository';
import { UserProgressRepository } from '../ports/UserProgressRepository';
import { VolumeStartRepository } from '../ports/VolumeStartRepository';

export class ContinueVolume {
  constructor(
    private chapterRepository: ChapterRepository,
    private volumeRepository: VolumeRepository,
    private userProgressRepository: UserProgressRepository,
    private volumeStartRepository: VolumeStartRepository,
  ) {}

  async execute(volumeId: string, userId: string): Promise<{ status: number; body: Record<string, unknown> }> {
    const volume = await this.volumeRepository.findById(volumeId);
    if (!volume) {
      return { status: 404, body: { message: 'Volumen no encontrado' } };
    }

    await this.volumeStartRepository.markStarted(userId, volumeId);

    const chapters = await this.chapterRepository.findByVolumeId(volumeId);
    const chapterIds = chapters.map((ch) => ch.id);
    const progressRecords = await this.userProgressRepository.findByUserAndChapterIds(userId, chapterIds);

    const completedChapterIds = new Set(
      progressRecords.filter((p) => p.isCompleted).map((p) => p.chapterId),
    );

    const nextChapter = chapters.find((ch) => !completedChapterIds.has(ch.id));

    if (!nextChapter) {
      return { status: 200, body: { message: 'Todos los capítulos completados', completed: true } };
    }

    return {
      status: 200,
      body: {
        id: nextChapter.id,
        volumeId: nextChapter.volumeId,
        title: nextChapter.title,
        type: nextChapter.type,
        contentUrl: nextChapter.contentUrl,
        isCompleted: false,
      },
    };
  }
}
