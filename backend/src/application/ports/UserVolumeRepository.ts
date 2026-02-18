export interface UserVolumeRepository {
  findVolumeIdsByUserId(userId: string): string[];
  save(userId: string, volumeId: string): void;
}
