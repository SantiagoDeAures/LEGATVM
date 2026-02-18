import { UserVolumeRepository } from '../../application/ports/UserVolumeRepository';

export class InMemoryUserVolumeRepository implements UserVolumeRepository {
  private entries: { userId: string; volumeId: string }[] = [];

  findVolumeIdsByUserId(userId: string): string[] {
    return this.entries
      .filter((e) => e.userId === userId)
      .map((e) => e.volumeId);
  }

  save(userId: string, volumeId: string): void {
    this.entries.push({ userId, volumeId });
  }
}
