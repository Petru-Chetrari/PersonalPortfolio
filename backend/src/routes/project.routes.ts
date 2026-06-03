import { Router } from 'express';
import { ProjectController } from '../controllers/project.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = Router();

// GET is public (portfolio display on the landing page)
router.get('/', ProjectController.list);
router.get('/:id', ProjectController.getById);

// Mutations are admin-only
router.post('/', authenticate, authorize('admin'), ProjectController.create);
router.put('/:id', authenticate, authorize('admin'), ProjectController.update);
router.delete('/:id', authenticate, authorize('admin'), ProjectController.remove);

export default router;
