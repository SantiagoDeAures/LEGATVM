import { UserVolumeRepository } from '../ports/UserVolumeRepository';
import { VolumeRepository } from '../ports/VolumeRepository';

export class GetUserVolumes {
  constructor(
    private userVolumeRepository: UserVolumeRepository,
    private volumeRepository: VolumeRepository,
  ) {}

  execute(userId: string): { status: number; body: { data: Array<{ id: string; title: string; thumbnail: string }> } } {
    const volumeIds = this.userVolumeRepository.findVolumeIdsByUserId(userId);
    const allVolumes = this.volumeRepository.findAll();

    const userVolumes = allVolumes
      .filter((v) => volumeIds.includes(v.id))
      .map((v) => ({
        id: v.id,
        title: v.title,
        thumbnail: v.thumbnail,
      }));

    return { status: 200, body: { data: userVolumes } };
  }
}
