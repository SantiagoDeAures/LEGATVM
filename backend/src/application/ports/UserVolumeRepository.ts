export interface UserVolumeRepository {
  findVolumeIdsByUserId(userId: string): Promise<string[]>;
  hasVolume(userId: string, volumeId: string): Promise<boolean>;
  save(userId: string, volumeId: string): Promise<void>;
}
