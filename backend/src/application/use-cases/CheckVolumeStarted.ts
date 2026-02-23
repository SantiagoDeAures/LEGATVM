import { VolumeRepository } from '../ports/VolumeRepository';
import { VolumeStartRepository } from '../ports/VolumeStartRepository';

export class CheckVolumeStarted {
  constructor(
    private volumeRepository: VolumeRepository,
    private volumeStartRepository: VolumeStartRepository,
  ) {}

  async execute(userId: string, volumeId: string): Promise<{ status: number; body: Record<string, unknown> }> {
    const volume = await this.volumeRepository.findById(volumeId);
    if (!volume) {
      return { status: 404, body: { message: 'Volumen no encontrado' } };
    }

    const started = await this.volumeStartRepository.hasStarted(userId, volumeId);

    return {
      status: 200,
      body: { started },
    };
  }
}
