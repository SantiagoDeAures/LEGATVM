import { TokenProvider } from "../ports/TokenProvider";

interface TokenPayload {
    userId: string;
}

export class RotateToken {
    constructor(
        private tokenProvider: TokenProvider
    ) { }

    async execute(refreshToken: string): Promise<string | object> {
        const validateToken = await this.tokenProvider.verify(refreshToken)
        if (!validateToken) {
            throw new Error('token invalido')
        }

        const { userId } = validateToken as TokenPayload

        const accessToken = await this.tokenProvider.generateAccessToken(userId)

        return accessToken
    }
}