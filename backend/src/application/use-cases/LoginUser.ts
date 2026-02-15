import { User } from '../../domain/User';
import { UserRepository } from '../ports/UserRepository';
import { WalletRepository } from '../ports/WalletRepository';

interface LoginUserRequest {
  email: string;
  password: string;
}


export class LoginUser {
  constructor(
    private userRepository: UserRepository,
    private walletRepository: WalletRepository
  ) {}

  async execute(request: LoginUserRequest): Promise<{ status: number; body: Record<string, unknown>; }> {
    const { email, password } = request;

    if (!email || !password) {
      return { status: 400, body: { message: 'Faltan campos requeridos' } };
    }

    const user = this.userRepository.findByEmail(email);
    if (!user || !(await user.passwordMatches(password))) {
      return { status: 401, body: { message: 'Credenciales inválidas' } };
    }

    const walletBalance = await this.walletRepository.getWalletByUserId(user.id)

    return {
      status: 200,
      body: {
        user: {
          id: user?.id,
          username: user?.username,
          email: user?.email,
          wallet: { balance: walletBalance },
        },
      },
    };
  }
}
