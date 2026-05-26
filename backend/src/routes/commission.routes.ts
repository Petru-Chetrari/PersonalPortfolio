import { Router } from 'express';
import { CommissionController } from '../controllers/commission.controller';

const router = Router();

// IMPORTANT: /stats must be declared before /:id to avoid Express treating "stats" as an id
router.get('/stats', CommissionController.stats);
router.get('/', CommissionController.list);
router.get('/:id', CommissionController.getById);
router.post('/', CommissionController.create);
router.put('/:id', CommissionController.update);
router.patch('/:id/status', CommissionController.patchStatus);
router.delete('/:id', CommissionController.remove);

export default router;
