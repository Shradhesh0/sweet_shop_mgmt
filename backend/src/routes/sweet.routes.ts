import { Router } from 'express';
import {
  createSweet,
  getAllSweets,
  searchSweets,
  updateSweet,
  deleteSweet
} from '../controllers/sweet.controller';
import { authenticateToken, requireAdmin } from '../middleware/auth';

const router = Router();

router.post('/', authenticateToken, createSweet);
router.get('/', authenticateToken, getAllSweets);
router.get('/search', authenticateToken, searchSweets);
router.put('/:id', authenticateToken, updateSweet);
router.delete('/:id', authenticateToken, requireAdmin, deleteSweet);

export default router;