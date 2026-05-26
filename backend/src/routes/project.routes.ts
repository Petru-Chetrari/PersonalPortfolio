import { Router } from 'express';
import { ProjectController } from '../controllers/project.controller';

const router = Router();

router.get('/', ProjectController.list);
router.get('/:id', ProjectController.getById);
router.post('/', ProjectController.create);
router.put('/:id', ProjectController.update);
router.delete('/:id', ProjectController.remove);

export default router;
