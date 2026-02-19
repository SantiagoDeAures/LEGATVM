import { VolumeRepository } from '../ports/VolumeRepository';
import { WalletRepository } from '../ports/WalletRepository';
import { UserVolumeRepository } from '../ports/UserVolumeRepository';

export class PurchaseVolume {
  constructor(
    private volumeRepository: VolumeRepository,
    private walletRepository: WalletRepository,
    private userVolumeRepository: UserVolumeRepository,
  ) {}

  async execute(userId: string, volumeId: string): Promise<{ status: number; body: Record<string, unknown> }> {
    const volume = this.volumeRepository.findById(volumeId);
    if (!volume) {
      return { status: 404, body: { message: 'Volumen no encontrado' } };
    }

    const alreadyOwned = this.userVolumeRepository.hasVolume(userId, volumeId);
    if (alreadyOwned) {
      return { status: 409, body: { message: 'Ya posees este volumen' } };
    }

    const wallet = await this.walletRepository.getWalletByUserId(userId);
    if (!wallet) {
      return { status: 404, body: { message: 'Wallet no encontrada' } };
    }

    try {
      wallet.debit(volume.price);
    } catch {
      return { status: 400, body: { message: 'Saldo insuficiente' } };
    }

    await this.walletRepository.update(userId, wallet);
    this.userVolumeRepository.save(userId, volumeId);

    return {
      status: 200,
      body: {
        message: 'Volumen comprado exitosamente',
        remainingBalance: wallet.balance,
      },
    };
  }
}
