import { Router } from 'express';
import { GetVolumes } from '../../../application/use-cases/GetVolumes';
import { GetVolumeDetails } from '../../../application/use-cases/GetVolumeDetails';
import { ContinueVolume } from '../../../application/use-cases/ContinueVolume';
import { GetPrueba } from '../../../application/use-cases/GetPrueba';
import { PurchaseVolume } from '../../../application/use-cases/PurchaseVolume';
import { CheckVolumeStarted } from '../../../application/use-cases/CheckVolumeStarted';

export function createVolumeRouter(getVolumes: GetVolumes, getVolumeDetails: GetVolumeDetails, continueVolume: ContinueVolume, getPrueba: GetPrueba, purchaseVolume: PurchaseVolume, checkVolumeStarted: CheckVolumeStarted): Router {
  const router = Router();

  router.get('/', (req, res) => {
    const category = req.query.category as string | undefined;
    const result = getVolumes.execute(category);
    return res.status(result.status).json(result.body);
  });

  router.get('/:volumeId/continue', (req, res) => {
    const userId = (req as any).userId as string;
    const result = continueVolume.execute(req.params.volumeId, userId);
    return res.status(result.status).json(result.body);
  });

  router.get('/:volumeId/:chapterId/prueba', (req, res) => {
    const result = getPrueba.execute(req.params.volumeId, req.params.chapterId);
    return res.status(result.status).json(result.body);
  });

  router.post('/:volumeId/purchase', async (req, res) => {
    const userId = (req as any).userId as string;
    const result = await purchaseVolume.execute(userId, req.params.volumeId);
    return res.status(result.status).json(result.body);
  });

  router.get('/:volumeId/started', (req, res) => {
    const userId = (req as any).userId as string;
    const result = checkVolumeStarted.execute(userId, req.params.volumeId);
    return res.status(result.status).json(result.body);
  });

  router.get('/:volumeId', (req, res) => {
    const userId = (req as any).userId as string;
    const result = getVolumeDetails.execute(req.params.volumeId, userId);
    return res.status(result.status).json(result.body);
  });

  return router;
}
