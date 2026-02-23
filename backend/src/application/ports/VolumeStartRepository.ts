export interface VolumeStartRepository {
  hasStarted(userId: string, volumeId: string): Promise<boolean>;
  markStarted(userId: string, volumeId: string): Promise<void>;
  markUnstarted(userId: string, volumeId: string): Promise<void>;
}
