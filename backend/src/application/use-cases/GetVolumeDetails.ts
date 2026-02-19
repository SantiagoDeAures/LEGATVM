import { VolumeRepository } from '../ports/VolumeRepository';

export class GetVolumeDetails {
  constructor(private volumeRepository: VolumeRepository) {}

  execute(volumeId: string): { status: number; body: Record<string, unknown> } {
    const volume = this.volumeRepository.findById(volumeId);
    if (!volume) {
      return { status: 404, body: { message: 'Volumen no encontrado' } };
    }

    return {
      status: 200,
      body: {
        id: volume.id,
        title: volume.title,
        description: volume.description,
        categories: volume.categories,
        thumbnail: volume.thumbnail,
      },
    };
  }
}
