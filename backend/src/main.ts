import express from 'express';
import { InMemoryUserRepository } from './infrastructure/persistence/InMemoryUserRepository';
import { RegisterUser } from './application/use-cases/RegisterUser';
import { LoginUser } from './application/use-cases/LoginUser';
import { createAuthRouter } from './infrastructure/http/routes/authRoutes';
import { InMemoryWalletRepository } from './infrastructure/persistence/InMemoryWalletRepository';
import { InMemoryAuthRepository } from './infrastructure/persistence/InMemoryAuthRepository'
import { JwtTokenProvider } from './infrastructure/JwtTokenProvider'
import cookieparser from 'cookie-parser'
import cors from 'cors'
import { User } from './domain/User';
import { Wallet } from './domain/Wallet';
import { LogoutUser } from './application/use-cases/LogoutUser';
import { RotateToken } from './application/use-cases/RotateToken';
import { createAuthMiddleware } from './infrastructure/http/middleware/authMiddleware';

export const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));

app.use(cookieparser())

// Persistence
const userRepository = new InMemoryUserRepository();
const walletRepository = new InMemoryWalletRepository();
const authRepository = new InMemoryAuthRepository();
const authProvider = new JwtTokenProvider()

// Auth Middleware
app.use(createAuthMiddleware(authProvider));

//Datos de prueba para test**********************************************************************************************
const nextWeek = new Date();
const user1 = await User.create('user-uuid-1', 'Ana Developer', 'ana@test.com', '123456');
// Simulamos que Ana ya tiene 500 monedas (más del inicial)
const wallet1 = new Wallet('user-uuid-1', 500);
await authRepository.saveRefreshToken({
  token: 'token-seguro-para-logout-123', // El token crudo
  userId: 'user-uuid-1',                 // Pertenece a Ana
  expiresAt: nextWeek
});
userRepository.save(user1)
walletRepository.save(wallet1)

//**************************************************************************************************************** */

// Use Cases
const registerUser = new RegisterUser(userRepository, walletRepository);
const loginUser = new LoginUser(userRepository, walletRepository, authRepository, authProvider);
const logoutUser = new LogoutUser(authRepository)
const rotateToken = new RotateToken(authProvider)


// Transport
app.use('/api/auth', createAuthRouter(registerUser, loginUser, logoutUser, rotateToken));

app.get('/', (req, res) => {
  res.send('Hello world');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

export default app;

/*

curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email": "usuario@test.com", "password": "password123", "username": "Amanda10"}' \
  -v

  curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "ana@test.com", "password": "123456"}' \
  -c cookies.txt \
  -v

  curl -X POST http://localhost:3000/api/auth/refresh \
  -b cookies.txt \
  -v
*/