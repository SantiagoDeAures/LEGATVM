import { User } from '../../domain/User';

export interface UserRepository {
  findByEmail(email: string): User | undefined;
  findByUsername(username: string): User | undefined;
  save(user: User): void;
}
