import { Router } from 'express';
import { CommissionController } from '../controllers/commission.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = Router();

// IMPORTANT: /stats must be declared before /:id to avoid Express treating "stats" as an id
router.get('/stats', authenticate, authorize('admin'), CommissionController.stats);
router.get('/', authenticate, CommissionController.list);
router.get('/:id', authenticate, CommissionController.getById);
router.post('/', authenticate, authorize('client'), CommissionController.create);
router.put('/:id', authenticate, authorize('admin'), CommissionController.update);
router.patch('/:id/status', authenticate, authorize('admin'), CommissionController.patchStatus);
router.delete('/:id', authenticate, authorize('admin'), CommissionController.remove);

export default router;
