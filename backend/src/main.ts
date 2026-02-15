import express from 'express';
import { InMemoryUserRepository } from './infrastructure/persistence/InMemoryUserRepository';
import { RegisterUser } from './application/use-cases/RegisterUser';
import { LoginUser } from './application/use-cases/LoginUser';
import { createAuthRouter } from './infrastructure/http/routes/authRoutes';
import { InMemoryWalletRepository } from './infrastructure/persistence/InMemoryWalletRepository';

export const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Persistence
const userRepository = new InMemoryUserRepository();
const walletRepository = new InMemoryWalletRepository();

// Use Cases
const registerUser = new RegisterUser(userRepository, walletRepository);
const loginUser = new LoginUser(userRepository, walletRepository);

// Transport
app.use('/api/auth', createAuthRouter(registerUser, loginUser));

app.get('/', (req, res) => {
  res.send('Hello world');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

export default app;
