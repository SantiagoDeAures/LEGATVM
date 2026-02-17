import { createHash } from "crypto";
import { AuthRepository, RefreshTokenData } from "../../application/ports/AuthRepository";

export class InMemoryAuthRepository implements AuthRepository {

    private sessions: {tokenHash: string; userId: string; expiresAt: Date}[] = []

    private hashToken(token: string): string {
        return createHash('sha256').update(token).digest('hex')
    }

    async saveRefreshToken(data: RefreshTokenData): Promise<void>{
        const hashedToken = this.hashToken(data.token)
        this.sessions.push({
            tokenHash: hashedToken,
            userId: data.userId,
            expiresAt: data.expiresAt
        })
    }

    async findRefreshToken(token: string): Promise<RefreshTokenData | null>{
        const hashedToken = this.hashToken(token)
        const session = this.sessions.find(t => t.tokenHash === hashedToken)

        if(session && session.expiresAt > new Date()){
            return {
                token: token,
                userId: session.userId,
                expiresAt: session.expiresAt
            }
        }

        return null
    }

    async revokeRefreshToken(token: string): Promise<void> {
        const hashedToken = this.hashToken(token)
        this.sessions = this.sessions.filter(t => t.tokenHash !== hashedToken)

    }
}