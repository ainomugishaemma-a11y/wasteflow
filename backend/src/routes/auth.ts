import { Router } from 'express';
import AuthController from '../controllers/authController';
import { authenticateToken, authorize } from '../middleware/auth';

const router = Router();

router.post('/register', authenticateToken, authorize('admin'), AuthController.register);
router.post('/login', AuthController.login);
router.post('/logout', authenticateToken, AuthController.logout);
router.post('/refresh-token', AuthController.refreshToken);
router.post('/forgot-password', AuthController.forgotPassword);

export default router;
