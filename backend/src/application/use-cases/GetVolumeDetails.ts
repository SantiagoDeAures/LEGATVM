import { VolumeRepository } from '../ports/VolumeRepository';
import { UserVolumeRepository } from '../ports/UserVolumeRepository';

export class GetVolumeDetails {
  constructor(
    private volumeRepository: VolumeRepository,
    private userVolumeRepository: UserVolumeRepository,
  ) {}

  async execute(volumeId: string, userId: string): Promise<{ status: number; body: Record<string, unknown> }> {
    const volume = await this.volumeRepository.findById(volumeId);
    if (!volume) {
      return { status: 404, body: { message: 'Volumen no encontrado' } };
    }

    const owned = await this.userVolumeRepository.hasVolume(userId, volumeId);

    return {
      status: 200,
      body: {
        id: volume.id,
        title: volume.title,
        description: volume.description,
        categories: volume.categories,
        price: volume.price,
        thumbnail: volume.thumbnail,
        owned
      },
    };
  }
}
