import { Router } from 'express';
import { InteractionController } from '../controllers/interaction.controller';

const router = Router();

router.get('/', InteractionController.list);
router.get('/:date', InteractionController.getByDate);
router.post('/', InteractionController.create);
router.put('/:date', InteractionController.update);
router.post('/:date/increment', InteractionController.increment);
router.delete('/:date', InteractionController.remove);

export default router;
