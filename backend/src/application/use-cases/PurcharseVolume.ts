import { WalletRepository } from "../ports/WalletRepository"

interface PurcharseVolumeRequest{
    userId: string,
    itemPrice: number
}

export class PurcharseVolume{
    constructor( private walletRepository: WalletRepository){}

    async execute(request: PurcharseVolumeRequest){

       const wallet = await this.walletRepository.getWalletByUserId(request.userId)

       if(typeof wallet === 'number'){
        throw new Error('No tienes suficiente monedas')
       }

       wallet.debit(request.itemPrice);

       await this.walletRepository.update(request.userId, wallet)
    }
}