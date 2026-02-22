import { User } from '../../domain/User';

export interface UserRepository {
  findById(id: string): User | undefined;
  findByEmail(email: string): User | undefined;
  findByUsername(username: string): User | undefined;
  save(user: User): void;
}
