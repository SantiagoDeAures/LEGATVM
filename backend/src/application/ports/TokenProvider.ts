export interface TokenProvider {
    generateAccessToken(userId: string): string;
    generateRefreshToken(userId: string): string;
    verify(token: string): string | object;
}