import { VolumeStartRepository } from '../../application/ports/VolumeStartRepository.js';

export class InMemoryVolumeStartRepository implements VolumeStartRepository {
  private entries: { userId: string; volumeId: string }[] = [];

  async hasStarted(userId: string, volumeId: string): Promise<boolean> {
    return this.entries.some((e) => e.userId === userId && e.volumeId === volumeId);
  }

  async markStarted(userId: string, volumeId: string): Promise<void> {
    const started = await this.hasStarted(userId, volumeId);
    if (!started) {
      this.entries.push({ userId, volumeId });
    }
  }

  async markUnstarted(userId: string, volumeId: string): Promise<void> {
    this.entries = this.entries.filter(
      (e) => !(e.userId === userId && e.volumeId === volumeId)
    );
  }
}
