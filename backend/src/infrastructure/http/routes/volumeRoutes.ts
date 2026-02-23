import { Router } from 'express';
import { GetVolumes } from '../../../application/use-cases/GetVolumes';
import { GetVolumeDetails } from '../../../application/use-cases/GetVolumeDetails';
import { ContinueVolume } from '../../../application/use-cases/ContinueVolume';
import { GetPrueba } from '../../../application/use-cases/GetPrueba';
import { PurchaseVolume } from '../../../application/use-cases/PurchaseVolume';
import { CheckVolumeStarted } from '../../../application/use-cases/CheckVolumeStarted';

export function createVolumeRouter(getVolumes: GetVolumes, getVolumeDetails: GetVolumeDetails, continueVolume: ContinueVolume, getPrueba: GetPrueba, purchaseVolume: PurchaseVolume, checkVolumeStarted: CheckVolumeStarted): Router {
  const router = Router();

  router.get('/', async (req, res) => {
    const category = req.query.category as string | undefined;
    const result = await getVolumes.execute(category);
    return res.status(result.status).json(result.body);
  });

  router.get('/:volumeId/continue', async (req, res) => {
    const userId = (req as any).userId as string;
    const result = await continueVolume.execute(req.params.volumeId, userId);
    return res.status(result.status).json(result.body);
  });

  router.get('/:volumeId/:chapterId/prueba', async (req, res) => {
    const result = await getPrueba.execute(req.params.volumeId, req.params.chapterId);
    return res.status(result.status).json(result.body);
  });

  router.post('/:volumeId/purchase', async (req, res) => {
    const userId = (req as any).userId as string;
    const result = await purchaseVolume.execute(userId, req.params.volumeId);
    return res.status(result.status).json(result.body);
  });

  router.get('/:volumeId/started', async (req, res) => {
    const userId = (req as any).userId as string;
    const result = await checkVolumeStarted.execute(userId, req.params.volumeId);
    return res.status(result.status).json(result.body);
  });

  router.get('/:volumeId', async (req, res) => {
    const userId = (req as any).userId as string;
    const result = await getVolumeDetails.execute(req.params.volumeId, userId);
    return res.status(result.status).json(result.body);
  });

  return router;
}
