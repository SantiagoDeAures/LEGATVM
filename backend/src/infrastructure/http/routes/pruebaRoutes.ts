import { Router } from 'express';
import { SubmitPrueba } from '../../../application/use-cases/SubmitPrueba';

export function createPruebaRouter(submitPrueba: SubmitPrueba): Router {
  const router = Router();

  router.post('/:pruebaId/submit', (req, res) => {
    const userId = (req as any).userId as string;
    const result = submitPrueba.execute(req.params.pruebaId, userId, req.body.answers);
    return res.status(result.status).json(result.body);
  });

  return router;
}
