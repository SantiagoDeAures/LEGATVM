import { PruebaRepository } from '../ports/PruebaRepository';

export class GetPrueba {
  constructor(private pruebaRepository: PruebaRepository) {}

  execute(volumeId: string, chapterId: string): { status: number; body: Record<string, unknown> } {
    const prueba = this.pruebaRepository.findByVolumeAndChapter(volumeId, chapterId);
    if (!prueba) {
      return { status: 404, body: { message: 'Prueba no encontrada' } };
    }

    return {
      status: 200,
      body: {
        id: prueba.id,
        questions: prueba.questions.map((q) => ({
          id: q.id,
          question: q.question,
          options: q.options.map((o) => ({
            id: o.id,
            text: o.text,
          })),
        })),
      },
    };
  }
}
