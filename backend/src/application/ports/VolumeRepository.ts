import { Volume } from '../../domain/Volume';

export interface VolumeRepository {
  findAll(): Volume[];
  findByCategory(category: string): Volume[];
}
