import { Router } from 'express';
import { UserModel } from '../models/User';
import { authenticateToken, authorize } from '../middleware/auth';
import logger from '../utils/logger';

const router = Router();

router.get('/', authenticateToken, authorize('admin'), async (req, res) => {
  try {
    const users = await UserModel.findAll(100, 0);
    const safe = users.map(({ password, ...u }) => u);
    res.json({ users: safe });
  } catch (error) {
    logger.error('Get users error:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

router.delete('/:id', authenticateToken, authorize('admin'), async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (id === 1) {
      res.status(400).json({ error: 'Cannot delete the primary admin user' });
      return;
    }
    const deleted = await UserModel.delete(id);
    if (!deleted) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    res.json({ message: 'User deleted' });
  } catch (error) {
    logger.error('Delete user error:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

export default router;
