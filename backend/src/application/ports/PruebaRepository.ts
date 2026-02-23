import { Prueba } from '../../domain/Prueba';

export interface PruebaRepository {
  findByVolumeAndChapter(volumeId: string, chapterId: string): Promise<Prueba | undefined>;
  findById(id: string): Promise<Prueba | undefined>;
}
