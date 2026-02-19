import { VolumeRepository } from '../ports/VolumeRepository';

export class GetVolumes {
  constructor(private volumeRepository: VolumeRepository) {}

  execute(category?: string): { status: number; body: { data: Array<{ id: string; title: string; thumbnail: string }> } } {
    const volumes = category
      ? this.volumeRepository.findByCategory(category)
      : this.volumeRepository.findAll();

    const data = volumes.map((v) => ({
      id: v.id,
      title: v.title,
      thumbnail: v.thumbnail,
      categories: v.categories
    }));

    return { status: 200, body: { data } };
  }
}
