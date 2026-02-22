import { PruebaRepository } from '../ports/PruebaRepository';
import { UserProgressRepository } from '../ports/UserProgressRepository';
import { ChapterRepository } from '../ports/ChapterRepository';
import { VolumeStartRepository } from '../ports/VolumeStartRepository';
import { UserProgress } from '../../domain/UserProgress';

interface SubmitAnswer {
  questionId: string;
  selectedOptions: string[];
}

const PASSING_THRESHOLD = 0.7;

export class SubmitPrueba {
  constructor(
    private pruebaRepository: PruebaRepository,
    private userProgressRepository: UserProgressRepository,
    private chapterRepository: ChapterRepository,
    private volumeStartRepository: VolumeStartRepository,
  ) {}

  execute(
    pruebaId: string,
    userId: string,
    answers: SubmitAnswer[] | undefined,
  ): { status: number; body: Record<string, unknown> } {
    if (!answers || !Array.isArray(answers)) {
      return { status: 400, body: { message: 'Se requieren las respuestas' } };
    }

    const prueba = this.pruebaRepository.findById(pruebaId);
    if (!prueba) {
      return { status: 404, body: { message: 'Prueba no encontrada' } };
    }

    // Grade each question
    let correctCount = 0;
    for (const question of prueba.questions) {
      const userAnswer = answers.find((a) => a.questionId === question.id);
      if (userAnswer) {
        const correct = this.isAnswerCorrect(question.correctOptionIds, userAnswer.selectedOptions);
        if (correct) correctCount++;
      }
    }

    const totalQuestions = prueba.questions.length;
    const score = totalQuestions > 0 ? correctCount / totalQuestions : 0;
    const passed = score >= PASSING_THRESHOLD;

    const responseBody: Record<string, unknown> = {
      score: Math.round(score * 100),
      passed,
      correctCount,
      totalQuestions,
    };

    // If passed, mark the chapter as completed for this user
    if (passed) {
      this.userProgressRepository.save(
        new UserProgress(userId, prueba.chapterId, true),
      );

      // Check if all chapters in the volume are now completed
      const chapters = this.chapterRepository.findByVolumeId(prueba.volumeId);
      const chapterIds = chapters.map((ch) => ch.id);
      const allProgress = this.userProgressRepository.findByUserAndChapterIds(userId, chapterIds);
      const completedIds = new Set(
        allProgress.filter((p) => p.isCompleted).map((p) => p.chapterId),
      );
      const volumeCompleted = chapters.every((ch) => completedIds.has(ch.id));
      responseBody.volumeCompleted = volumeCompleted;

      if (volumeCompleted) {
        this.volumeStartRepository.markUnstarted(userId, prueba.volumeId);
        this.userProgressRepository.deleteByUserAndChapterIds(userId, chapterIds);
        responseBody.message = 'Has llegado al final de esta historia y has aprendido cosas nuevas, es hora de celebrar!';
      }
    }

    return { status: 200, body: responseBody };
  }

  private isAnswerCorrect(correctOptionIds: string[], selectedOptions: string[]): boolean {
    if (correctOptionIds.length !== selectedOptions.length) return false;
    const sortedCorrect = [...correctOptionIds].sort();
    const sortedSelected = [...selectedOptions].sort();
    return sortedCorrect.every((id, index) => id === sortedSelected[index]);
  }
}
