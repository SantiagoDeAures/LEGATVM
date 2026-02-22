import { User } from '../../domain/User';
import { UserRepository } from '../../application/ports/UserRepository';

export class InMemoryUserRepository implements UserRepository {
  private users: User[] = [];

  findById(id: string): User | undefined {
    return this.users.find(u => u.id === id);
  }

  findByEmail(email: string): User | undefined {
    return this.users.find(u => u.email === email);
  }

  findByUsername(username: string): User | undefined {
    console.log(this.users)
    return this.users.find(u => u.username === username);
  }

  save(user: User): void {
    this.users.push(user);
  }

}
