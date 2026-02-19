import { WalletRepository } from "../../application/ports/WalletRepository";
import { Wallet } from "../../domain/Wallet";

export class InMemoryWalletRepository implements WalletRepository{
    private wallets: Wallet[] = []

    async getWalletByUserId(userId: string): Promise<Wallet | undefined>{
        return this.wallets.find(w => w.userId === userId)
    }

    async update(userId: string, wallet: Wallet): Promise<void>{
        const index = this.wallets.findIndex(W => W.userId === userId)
        this.wallets[index] = wallet
    }

    save(wallet: Wallet): void{
        this.wallets.push(wallet)
    }
}