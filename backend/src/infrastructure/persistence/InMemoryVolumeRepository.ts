import { Volume } from '../../domain/Volume.js';
import { VolumeRepository } from '../../application/ports/VolumeRepository.js';

export class InMemoryVolumeRepository implements VolumeRepository {
  private volumes: Volume[] = [];

  async findAll(): Promise<Volume[]> {
    return this.volumes;
  }

  async findById(id: string): Promise<Volume | undefined> {
    return this.volumes.find((v) => v.id === id);
  }

  async findByCategory(category: string): Promise<Volume[]> {
    return this.volumes.filter((v) =>
      v.categories.some((c) => c.toLowerCase() === category.toLowerCase())
    );
  }

  async save(volume: Volume): Promise<void> {
    this.volumes.push(volume);
  }
}
