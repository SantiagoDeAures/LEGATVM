export interface UserVolumeRepository {
  findVolumeIdsByUserId(userId: string): string[];
  hasVolume(userId: string, volumeId: string): boolean;
  save(userId: string, volumeId: string): void;
}
