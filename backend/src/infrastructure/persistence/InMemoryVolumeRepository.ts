import { Volume } from '../../domain/Volume';
import { VolumeRepository } from '../../application/ports/VolumeRepository';

export class InMemoryVolumeRepository implements VolumeRepository {
  private volumes: Volume[] = [];

  findAll(): Volume[] {
    return this.volumes;
  }

  findById(id: string): Volume | undefined {
    return this.volumes.find((v) => v.id === id);
  }

  findByCategory(category: string): Volume[] {
    return this.volumes.filter((v) =>
      v.categories.some((c) => c.toLowerCase() === category.toLowerCase())
    );
  }

  save(volume: Volume): void {
    this.volumes.push(volume);
  }
}
