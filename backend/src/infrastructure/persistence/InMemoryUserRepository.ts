import { User } from '../../domain/User.js';
import { UserRepository } from '../../application/ports/UserRepository.js';

export class InMemoryUserRepository implements UserRepository {
  private users: User[] = [];

  async findById(id: string): Promise<User | undefined> {
    return this.users.find(u => u.id === id);
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return this.users.find(u => u.email === email);
  }

  async findByUsername(username: string): Promise<User | undefined> {
    return this.users.find(u => u.username === username);
  }

  async save(user: User): Promise<void> {
    this.users.push(user);
  }
}
