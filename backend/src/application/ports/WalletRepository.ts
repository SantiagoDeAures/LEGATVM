import { Wallet } from '../../domain/Wallet'

export interface WalletRepository {
    getWalletByUserId(userId: string): Promise <Wallet | number>;
    update(userId: string, wallet: Wallet): Promise<void>;
    save(user: Wallet): void;
}