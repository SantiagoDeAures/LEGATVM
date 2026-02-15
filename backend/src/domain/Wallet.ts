export class Wallet {

    private static readonly INITIAL_BALANCE = 150
    constructor(
        public readonly userId: string,
        public balance: number){}
        
    static createNew(userId: string): Wallet {
        return new Wallet(userId, Wallet.INITIAL_BALANCE);
    }

    debit(amount: number): void {
        if(this.balance){
            throw new Error("Saldo insuficiente")
        }

        this.balance -= amount;
    }
}