import { Volume } from '../../domain/Volume';

export interface VolumeRepository {
  findAll(): Promise<Volume[]>;
  findById(id: string): Promise<Volume | undefined>;
  findByCategory(category: string): Promise<Volume[]>;
}
