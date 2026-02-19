import { VolumeRepository } from '../ports/VolumeRepository';
import { VolumeStartRepository } from '../ports/VolumeStartRepository';

export class CheckVolumeStarted {
  constructor(
    private volumeRepository: VolumeRepository,
    private volumeStartRepository: VolumeStartRepository,
  ) {}

  execute(userId: string, volumeId: string): { status: number; body: Record<string, unknown> } {
    const volume = this.volumeRepository.findById(volumeId);
    if (!volume) {
      return { status: 404, body: { message: 'Volumen no encontrado' } };
    }

    const started = this.volumeStartRepository.hasStarted(userId, volumeId);

    return {
      status: 200,
      body: { started },
    };
  }
}
