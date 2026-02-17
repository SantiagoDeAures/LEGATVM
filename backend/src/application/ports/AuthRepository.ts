export interface RefreshTokenData {
    token: string;
    userId: string;
    expiresAt: Date;
}

export interface AuthRepository {
    saveRefreshToken(data: RefreshTokenData): Promise<void>;
    findRefreshToken(token: string): Promise<RefreshTokenData | null>
    revokeRefreshToken(token: string): Promise<void>
}