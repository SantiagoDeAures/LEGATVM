import { Router } from 'express';
import { GetUserVolumes } from '../../../application/use-cases/GetUserVolumes';

export function createUserRouter(getUserVolumes: GetUserVolumes): Router {
  const router = Router();

  router.get('/volumes', (req, res) => {
    const userId = (req as any).userId;
    const result = getUserVolumes.execute(userId);
    return res.status(result.status).json(result.body);
  });

  return router;
}
