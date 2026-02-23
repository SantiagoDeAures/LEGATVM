import { User } from '../../domain/User';

export interface UserRepository {
  findById(id: string): Promise<User | undefined>;
  findByEmail(email: string): Promise<User | undefined>;
  findByUsername(username: string): Promise<User | undefined>;
  save(user: User): Promise<void>;
}
