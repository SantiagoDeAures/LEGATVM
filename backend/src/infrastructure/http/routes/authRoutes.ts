import { Router } from 'express';
import { RegisterUser } from '../../../application/use-cases/RegisterUser';
import { LoginUser } from '../../../application/use-cases/LoginUser';

export function createAuthRouter(registerUser: RegisterUser, loginUser: LoginUser): Router {
  const router = Router();

  router.post('/register', async (req, res) => {
    const result = await registerUser.execute(req.body);
    return res.status(result.status).json(result.body);
  });

  router.post('/login', async (req, res) => {
    const result = await loginUser.execute(req.body);
    return res.status(result.status).json(result.body);
  });

  return router;
}
