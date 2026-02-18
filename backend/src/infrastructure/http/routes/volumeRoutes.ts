import { Router } from 'express';
import { GetVolumes } from '../../../application/use-cases/GetVolumes';

export function createVolumeRouter(getVolumes: GetVolumes): Router {
  const router = Router();

  router.get('/', (req, res) => {
    const category = req.query.category as string | undefined;
    const result = getVolumes.execute(category);
    return res.status(result.status).json(result.body);
  });

  return router;
}
