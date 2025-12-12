import { Router } from 'express';
import { purchaseSweet, restockSweet } from '../controllers/inventory.controller';
import { authenticateToken, requireAdmin } from '../middleware/auth';

const router = Router();

router.post('/:id/purchase', authenticateToken, purchaseSweet);
router.post('/:id/restock', authenticateToken, requireAdmin, restockSweet);

export default router;