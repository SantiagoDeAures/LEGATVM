import { createHash } from 'crypto';
import pool from './connection';
import { AuthRepository, RefreshTokenData } from '../../../application/ports/AuthRepository';

export class PostgresAuthRepository implements AuthRepository {

  private hashToken(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }

  async saveRefreshToken(data: RefreshTokenData): Promise<void> {
    const hashedToken = this.hashToken(data.token);
    await pool.query(
      'INSERT INTO refresh_tokens (token_hash, user_id, expires_at) VALUES ($1, $2, $3)',
      [hashedToken, data.userId, data.expiresAt]
    );
  }

  async findRefreshToken(token: string): Promise<RefreshTokenData | null> {
    const hashedToken = this.hashToken(token);
    const { rows } = await pool.query(
      'SELECT user_id, expires_at FROM refresh_tokens WHERE token_hash = $1',
      [hashedToken]
    );

    if (rows.length === 0) return null;

    const row = rows[0];
    if (new Date(row.expires_at) <= new Date()) return null;

    return {
      token,
      userId: row.user_id,
      expiresAt: new Date(row.expires_at),
    };
  }

  async revokeRefreshToken(token: string): Promise<void> {
    const hashedToken = this.hashToken(token);
    await pool.query('DELETE FROM refresh_tokens WHERE token_hash = $1', [hashedToken]);
  }
}
