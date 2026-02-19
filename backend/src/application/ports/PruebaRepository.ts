import { Prueba } from '../../domain/Prueba';

export interface PruebaRepository {
  findByVolumeAndChapter(volumeId: string, chapterId: string): Prueba | undefined;
  findById(id: string): Prueba | undefined;
}
