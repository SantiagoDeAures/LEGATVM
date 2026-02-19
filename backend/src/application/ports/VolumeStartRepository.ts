export interface VolumeStartRepository {
  hasStarted(userId: string, volumeId: string): boolean;
  markStarted(userId: string, volumeId: string): void;
}
