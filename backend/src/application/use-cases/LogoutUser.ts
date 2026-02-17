import { AuthRepository, RefreshTokenData } from "../ports/AuthRepository";

export class LogoutUser {
    constructor(private authRepository: AuthRepository) { }

    async execute(refreshToken: string): Promise<void> {
        if (!refreshToken) return
        await this.authRepository.revokeRefreshToken(refreshToken)

    }
}