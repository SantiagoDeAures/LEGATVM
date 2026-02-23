import { UserVolumeRepository } from '../../application/ports/UserVolumeRepository.js';

export class InMemoryUserVolumeRepository implements UserVolumeRepository {
  private entries: { userId: string; volumeId: string }[] = [];

  async findVolumeIdsByUserId(userId: string): Promise<string[]> {
    return this.entries
      .filter((e) => e.userId === userId)
      .map((e) => e.volumeId);
  }

  async hasVolume(userId: string, volumeId: string): Promise<boolean> {
    return this.entries.some((e) => e.userId === userId && e.volumeId === volumeId);
  }

  async save(userId: string, volumeId: string): Promise<void> {
    this.entries.push({ userId, volumeId });
  }
}
