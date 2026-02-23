import pool from './connection';
import { User } from '../../../domain/User';
import { UserRepository } from '../../../application/ports/UserRepository';

export class PostgresUserRepository implements UserRepository {

  async findById(id: string): Promise<User | undefined> {
    const { rows } = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    if (rows.length === 0) return undefined;
    return User.fromPersistence(rows[0]);
  }

  async findByEmail(email: string): Promise<User | undefined> {
    const { rows } = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (rows.length === 0) return undefined;
    return User.fromPersistence(rows[0]);
  }

  async findByUsername(username: string): Promise<User | undefined> {
    const { rows } = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    if (rows.length === 0) return undefined;
    return User.fromPersistence(rows[0]);
  }

  async save(user: User): Promise<void> {
    await pool.query(
      `INSERT INTO users (id, username, email, password) VALUES ($1, $2, $3, $4)
       ON CONFLICT (id) DO UPDATE SET username = $2, email = $3, password = $4`,
      [user.id, user.username, user.email, user.password]
    );
  }
}
