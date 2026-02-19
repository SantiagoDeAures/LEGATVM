import { Volume } from '../../domain/Volume';

export interface VolumeRepository {
  findAll(): Volume[];
  findById(id: string): Volume | undefined;
  findByCategory(category: string): Volume[];
}
