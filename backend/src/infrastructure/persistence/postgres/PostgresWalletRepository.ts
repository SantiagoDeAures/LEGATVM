import pool from './connection';
import { Wallet } from '../../../domain/Wallet';
import { WalletRepository } from '../../../application/ports/WalletRepository';

export class PostgresWalletRepository implements WalletRepository {

  async getWalletByUserId(userId: string): Promise<Wallet | undefined> {
    const { rows } = await pool.query('SELECT * FROM wallets WHERE user_id = $1', [userId]);
    if (rows.length === 0) return undefined;
    return new Wallet(rows[0].user_id, Number(rows[0].balance));
  }

  async update(userId: string, wallet: Wallet): Promise<void> {
    await pool.query(
      'UPDATE wallets SET balance = $1 WHERE user_id = $2',
      [wallet.balance, userId]
    );
  }

  async save(wallet: Wallet): Promise<void> {
    await pool.query(
      'INSERT INTO wallets (user_id, balance) VALUES ($1, $2) ON CONFLICT (user_id) DO NOTHING',
      [wallet.userId, wallet.balance]
    );
  }
}
