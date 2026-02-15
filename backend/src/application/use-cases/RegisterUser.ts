import { User } from '../../domain/User';
import { Wallet } from '../../domain/Wallet';
import { UserRepository } from '../ports/UserRepository';
import { WalletRepository } from '../ports/WalletRepository';
import { v4 as uuidv4 } from 'uuid'

interface RegisterUserRequest {
  email: string;
  username: string;
  password: string;
}

interface RegisterUserResponse {
  message: string;
}

export class RegisterUser {
  constructor(
    private userRepository: UserRepository,
    private walletRepository: WalletRepository
  ) {}

  async execute(request: RegisterUserRequest): Promise<{ status: number; body: RegisterUserResponse; }> {
    const { email, username, password } = request;

    if (!email || !username || !password) {
      return { status: 400, body: { message: 'Faltan campos requeridos' } };
    }

    if (this.userRepository.findByEmail(email) || this.userRepository.findByUsername(username)) {
      return { status: 409, body: { message: 'Usuario o email ya existe' } };
    }

    const id = String(uuidv4())

    const newUser = await User.create(id, email, username, password)
    const newWallet = Wallet.createNew(newUser.id)

    this.userRepository.save(newUser);
    this.walletRepository.save(newWallet)

    return { status: 201, body: { message: 'Registro exitoso. Revisa tu correo para activar tu cuenta' } };
  }
}
