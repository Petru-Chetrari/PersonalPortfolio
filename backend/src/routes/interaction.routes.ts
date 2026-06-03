import { Router } from 'express';
import { InteractionController } from '../controllers/interaction.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = Router();

// All interaction routes are admin-only (analytics data)
router.get('/', authenticate, authorize('admin'), InteractionController.list);
router.get('/:date', authenticate, authorize('admin'), InteractionController.getByDate);
router.post('/', authenticate, authorize('admin'), InteractionController.create);
router.put('/:date', authenticate, authorize('admin'), InteractionController.update);
router.post('/:date/increment', authenticate, authorize('admin'), InteractionController.increment);
router.delete('/:date', authenticate, authorize('admin'), InteractionController.remove);

export default router;
