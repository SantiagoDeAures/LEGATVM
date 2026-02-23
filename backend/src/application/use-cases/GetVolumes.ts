import { VolumeRepository } from '../ports/VolumeRepository';

export class GetVolumes {
  constructor(private volumeRepository: VolumeRepository) {}

  async execute(category?: string): Promise<{ status: number; body: { data: Array<{ id: string; title: string; thumbnail: string }> } }> {
    const volumes = category
      ? await this.volumeRepository.findByCategory(category)
      : await this.volumeRepository.findAll();

    const data = volumes.map((v) => ({
      id: v.id,
      title: v.title,
      thumbnail: v.thumbnail,
      categories: v.categories
    }));

    return { status: 200, body: { data } };
  }
}
