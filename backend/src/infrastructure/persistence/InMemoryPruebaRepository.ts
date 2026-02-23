import { Prueba } from '../../domain/Prueba.js';
import { PruebaRepository } from '../../application/ports/PruebaRepository.js';

export class InMemoryPruebaRepository implements PruebaRepository {
  private pruebas: Prueba[] = [];

  async findByVolumeAndChapter(volumeId: string, chapterId: string): Promise<Prueba | undefined> {
    return this.pruebas.find(
      (p) => p.volumeId === volumeId && p.chapterId === chapterId,
    );
  }

  async findById(id: string): Promise<Prueba | undefined> {
    return this.pruebas.find((p) => p.id === id);
  }

  async save(prueba: Prueba): Promise<void> {
    this.pruebas.push(prueba);
  }
}
