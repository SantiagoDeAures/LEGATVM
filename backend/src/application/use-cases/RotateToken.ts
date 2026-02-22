import { TokenProvider } from "../ports/TokenProvider";
import { UserRepository } from "../ports/UserRepository";
import { WalletRepository } from "../ports/WalletRepository";

interface TokenPayload {
    userId: string;
}

export class RotateToken {
    constructor(
        private tokenProvider: TokenProvider,
        private userRepository: UserRepository,
        private walletRepository: WalletRepository
    ) { }

    async execute(refreshToken: string) {
        const validateToken = await this.tokenProvider.verify(refreshToken)
        if (!validateToken) {
            throw new Error('token invalido')
        }

        const { userId } = validateToken as TokenPayload

        const user = this.userRepository.findById(userId)
        if (!user) {
            throw new Error('Usuario no encontrado')
        }

        const wallet = await this.walletRepository.getWalletByUserId(userId)

        const accessToken = await this.tokenProvider.generateAccessToken(userId)

        return {
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                wallet: { balance: wallet?.balance ?? 0 },
            },
            accessToken
        }
    }
}