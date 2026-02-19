import { User } from '../../domain/User';
import { AuthRepository } from '../ports/AuthRepository';
import { TokenProvider } from '../ports/TokenProvider';
import { UserRepository } from '../ports/UserRepository';
import { WalletRepository } from '../ports/WalletRepository';

interface LoginUserRequest {
  email: string;
  password: string;
}


export class LoginUser {
  constructor(
    private userRepository: UserRepository,
    private walletRepository: WalletRepository,
    private authRepository: AuthRepository,
    private tokenProvider: TokenProvider
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

    const wallet = await this.walletRepository.getWalletByUserId(user.id)

    const accessToken = this.tokenProvider.generateAccessToken(user.id)
    const refreshToken = this.tokenProvider.generateRefreshToken(user.id)

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7)

    await this.authRepository.saveRefreshToken({
      token: refreshToken,
      userId: user.id,
      expiresAt: expiresAt
    })


    return {
      status: 200,
      body: {
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          wallet: { balance: wallet?.balance ?? 0 },
        },
        accessToken,
        refreshToken
      },
    };
  }
}
