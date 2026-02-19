import { VolumeStartRepository } from '../../application/ports/VolumeStartRepository';

export class InMemoryVolumeStartRepository implements VolumeStartRepository {
  private entries: { userId: string; volumeId: string }[] = [];

  hasStarted(userId: string, volumeId: string): boolean {
    return this.entries.some((e) => e.userId === userId && e.volumeId === volumeId);
  }

  markStarted(userId: string, volumeId: string): void {
    if (!this.hasStarted(userId, volumeId)) {
      this.entries.push({ userId, volumeId });
    }
  }
}
