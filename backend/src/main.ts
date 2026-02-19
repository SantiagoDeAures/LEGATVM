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
import { InMemoryVolumeRepository } from './infrastructure/persistence/InMemoryVolumeRepository';
import { Volume } from './domain/Volume';
import { GetVolumes } from './application/use-cases/GetVolumes';
import { GetVolumeDetails } from './application/use-cases/GetVolumeDetails';
import { createVolumeRouter } from './infrastructure/http/routes/volumeRoutes';
import { InMemoryUserVolumeRepository } from './infrastructure/persistence/InMemoryUserVolumeRepository';
import { GetUserVolumes } from './application/use-cases/GetUserVolumes';
import { createUserRouter } from './infrastructure/http/routes/userRoutes';
import { InMemoryChapterRepository } from './infrastructure/persistence/InMemoryChapterRepository';
import { Chapter } from './domain/Chapter';
import { ContinueVolume } from './application/use-cases/ContinueVolume';
import { InMemoryUserProgressRepository } from './infrastructure/persistence/InMemoryUserProgressRepository';
import { UserProgress } from './domain/UserProgress';
import { InMemoryPruebaRepository } from './infrastructure/persistence/InMemoryPruebaRepository';
import { Prueba, Question, Option } from './domain/Prueba';
import { GetPrueba } from './application/use-cases/GetPrueba';
import { SubmitPrueba } from './application/use-cases/SubmitPrueba';
import { createPruebaRouter } from './infrastructure/http/routes/pruebaRoutes';
import { PurchaseVolume } from './application/use-cases/PurchaseVolume';
import { InMemoryVolumeStartRepository } from './infrastructure/persistence/InMemoryVolumeStartRepository';
import { CheckVolumeStarted } from './application/use-cases/CheckVolumeStarted';

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
const volumeRepository = new InMemoryVolumeRepository();
const userVolumeRepository = new InMemoryUserVolumeRepository();
const chapterRepository = new InMemoryChapterRepository();
const userProgressRepository = new InMemoryUserProgressRepository();
const pruebaRepository = new InMemoryPruebaRepository();
const volumeStartRepository = new InMemoryVolumeStartRepository();

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

// Volumes de prueba
volumeRepository.save(new Volume('01', 'Historia de la IA', 'La IA desde sus orígenes', ['Historia', 'tecnología'], 0, 'https://res.cloudinary.com/dzbllqpfj/image/upload/v1771513999/TheIAStory_uwpe9v.png'));
volumeRepository.save(new Volume('02', 'Filosofía Griega', 'Desde Tales hasta Aristóteles', ['filosofía'], 100, 'https://example.com/filosofia.jpg'));

// Ana owns volume 01
userVolumeRepository.save('user-uuid-1', '01');

// Chapters for volume 01 (pure content, no progress state)
chapterRepository.save(new Chapter('ch-01', '01', 'Orígenes de la IA', 'video', 'https://res.cloudinary.com/dzbllqpfj/video/upload/v1771514149/IAstory-Chapter1_bwtkxj.mp4'));
chapterRepository.save(new Chapter('ch-02', '01', 'El test de Turing', 'video', 'https://res.cloudinary.com/dzbllqpfj/video/upload/v1771514156/IAStory-chaper2_iz8mfr.mp4'));
chapterRepository.save(new Chapter('ch-03', '01', 'Redes neuronales', 'video', 'https://res.cloudinary.com/dzbllqpfj/video/upload/v1771514168/IAStory-chaper3_lwdydx.mp4'));
chapterRepository.save(new Chapter('ch-04', '01', 'Aprendizaje profundo', 'video', 'https://res.cloudinary.com/dzbllqpfj/video/upload/v1771514265/IAStory-chaper4_sctpau.mp4'));

// Ana's progress on volume 01 — completed first 2 chapters
userProgressRepository.save(new UserProgress('user-uuid-1', 'ch-01', true));
userProgressRepository.save(new UserProgress('user-uuid-1', 'ch-02', true));

// Ana has started volume 01
volumeStartRepository.markStarted('user-uuid-1', '01');

// Prueba for chapter 01 of volume 01
pruebaRepository.save(new Prueba('01', '01', '01', [
  new Question('q_01', '¿Quién acuñó el término Inteligencia Artificial?', [
    new Option('a', 'Alan Turing'),
    new Option('b', 'John McCarthy'),
    new Option('c', 'Marvin Minsky'),
    new Option('d', 'Claude Shannon'),
  ], ['b']),
  new Question('q_02', '¿En qué año fue la conferencia de Dartmouth?', [
    new Option('a', '1950'),
    new Option('b', '1956'),
    new Option('c', '1960'),
    new Option('d', '1965'),
  ], ['b']),
  new Question('q_03', '¿Qué propuso Alan Turing en 1950?', [
    new Option('a', 'La máquina de Von Neumann'),
    new Option('b', 'El test de Turing'),
    new Option('c', 'El perceptrón'),
    new Option('d', 'La red neuronal'),
  ], ['b']),
  new Question('q_04', '¿Cuál fue el primer programa de ajedrez?', [
    new Option('a', 'Deep Blue'),
    new Option('b', 'Turochamp'),
    new Option('c', 'AlphaGo'),
    new Option('d', 'Stockfish'),
  ], ['b']),
  new Question('q_05', '¿Qué es el invierno de la IA?', [
    new Option('a', 'Una estación del año'),
    new Option('b', 'Un período de reducción de fondos e interés en IA'),
    new Option('c', 'Un algoritmo de enfriamiento'),
    new Option('d', 'Una técnica de optimización'),
  ], ['b']),
]));

//**************************************************************************************************************** */

// Use Cases
const registerUser = new RegisterUser(userRepository, walletRepository);
const loginUser = new LoginUser(userRepository, walletRepository, authRepository, authProvider);
const logoutUser = new LogoutUser(authRepository)
const rotateToken = new RotateToken(authProvider)
const getVolumes = new GetVolumes(volumeRepository);
const getVolumeDetails = new GetVolumeDetails(volumeRepository);
const getUserVolumes = new GetUserVolumes(userVolumeRepository, volumeRepository);
const continueVolume = new ContinueVolume(chapterRepository, volumeRepository, userProgressRepository, volumeStartRepository);
const getPrueba = new GetPrueba(pruebaRepository);
const submitPrueba = new SubmitPrueba(pruebaRepository, userProgressRepository, chapterRepository);
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