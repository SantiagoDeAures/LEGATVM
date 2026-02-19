import { Prueba } from '../../domain/Prueba';
import { PruebaRepository } from '../../application/ports/PruebaRepository';

export class InMemoryPruebaRepository implements PruebaRepository {
  private pruebas: Prueba[] = [];

  findByVolumeAndChapter(volumeId: string, chapterId: string): Prueba | undefined {
    return this.pruebas.find(
      (p) => p.volumeId === volumeId && p.chapterId === chapterId,
    );
  }

  findById(id: string): Prueba | undefined {
    return this.pruebas.find((p) => p.id === id);
  }

  save(prueba: Prueba): void {
    this.pruebas.push(prueba);
  }
}
