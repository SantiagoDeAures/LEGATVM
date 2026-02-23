import express from 'express';
import { PostgresUserRepository } from './infrastructure/persistence/postgres/PostgresUserRepository';
import { RegisterUser } from './application/use-cases/RegisterUser';
import { LoginUser } from './application/use-cases/LoginUser';
import { createAuthRouter } from './infrastructure/http/routes/authRoutes';
import { PostgresWalletRepository } from './infrastructure/persistence/postgres/PostgresWalletRepository';
import { PostgresAuthRepository } from './infrastructure/persistence/postgres/PostgresAuthRepository';
import { JwtTokenProvider } from './infrastructure/JwtTokenProvider'
import cookieparser from 'cookie-parser'
import cors from 'cors'
import { LogoutUser } from './application/use-cases/LogoutUser';
import { RotateToken } from './application/use-cases/RotateToken';
import { createAuthMiddleware } from './infrastructure/http/middleware/authMiddleware';
import { PostgresVolumeRepository } from './infrastructure/persistence/postgres/PostgresVolumeRepository';
import { GetVolumes } from './application/use-cases/GetVolumes';
import { GetVolumeDetails } from './application/use-cases/GetVolumeDetails';
import { createVolumeRouter } from './infrastructure/http/routes/volumeRoutes';
import { PostgresUserVolumeRepository } from './infrastructure/persistence/postgres/PostgresUserVolumeRepository';
import { GetUserVolumes } from './application/use-cases/GetUserVolumes';
import { createUserRouter } from './infrastructure/http/routes/userRoutes';
import { PostgresChapterRepository } from './infrastructure/persistence/postgres/PostgresChapterRepository';
import { ContinueVolume } from './application/use-cases/ContinueVolume';
import { PostgresUserProgressRepository } from './infrastructure/persistence/postgres/PostgresUserProgressRepository';
import { PostgresPruebaRepository } from './infrastructure/persistence/postgres/PostgresPruebaRepository';
import { GetPrueba } from './application/use-cases/GetPrueba';
import { SubmitPrueba } from './application/use-cases/SubmitPrueba';
import { createPruebaRouter } from './infrastructure/http/routes/pruebaRoutes';
import { PurchaseVolume } from './application/use-cases/PurchaseVolume';
import { PostgresVolumeStartRepository } from './infrastructure/persistence/postgres/PostgresVolumeStartRepository';
import { CheckVolumeStarted } from './application/use-cases/CheckVolumeStarted';

export const app: express.Application = express();
const port = process.env.PORT || 3000;

app.use(express.json());

const corsOrigin = process.env.FRONTEND_URL || 'http://localhost:5173';

app.use(cors({
  origin: corsOrigin,
  credentials: true,
}));

app.use(cookieparser())

// Persistence
const userRepository = new PostgresUserRepository();
const walletRepository = new PostgresWalletRepository();
const authRepository = new PostgresAuthRepository();
const authProvider = new JwtTokenProvider()
const volumeRepository = new PostgresVolumeRepository();
const userVolumeRepository = new PostgresUserVolumeRepository();
const chapterRepository = new PostgresChapterRepository();
const userProgressRepository = new PostgresUserProgressRepository();
const pruebaRepository = new PostgresPruebaRepository();
const volumeStartRepository = new PostgresVolumeStartRepository();

// Auth Middleware
app.use(createAuthMiddleware(authProvider));

// Use Cases
const registerUser = new RegisterUser(userRepository, walletRepository);
const loginUser = new LoginUser(userRepository, walletRepository, authRepository, authProvider);
const logoutUser = new LogoutUser(authRepository)
const rotateToken = new RotateToken(authProvider, userRepository, walletRepository)
const getVolumes = new GetVolumes(volumeRepository);
const getVolumeDetails = new GetVolumeDetails(volumeRepository, userVolumeRepository);
const getUserVolumes = new GetUserVolumes(userVolumeRepository, volumeRepository);
const continueVolume = new ContinueVolume(chapterRepository, volumeRepository, userProgressRepository, volumeStartRepository);
const getPrueba = new GetPrueba(pruebaRepository);
const submitPrueba = new SubmitPrueba(pruebaRepository, userProgressRepository, chapterRepository, volumeStartRepository);
const purchaseVolume = new PurchaseVolume(volumeRepository, walletRepository, userVolumeRepository);
const checkVolumeStarted = new CheckVolumeStarted(volumeRepository, volumeStartRepository);


// Transport
app.use('/api/auth', createAuthRouter(registerUser, loginUser, logoutUser, rotateToken));
app.use('/api/volumes', createVolumeRouter(getVolumes, getVolumeDetails, continueVolume, getPrueba, purchaseVolume, checkVolumeStarted));
app.use('/api/pruebas', createPruebaRouter(submitPrueba));
app.use('/api/users', createUserRouter(getUserVolumes));

app.get('/', (req, res) => {
  res.send('Hello world');
});

app.listen(port, () => {
  console.log(`Server running at port: ${port}`);
});

export default app;
