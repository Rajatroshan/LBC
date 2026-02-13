import { Router } from 'express';
import { DashboardController } from '../controllers/dashboard.controller';
import { authMiddleware, AuthRequest } from '../middlewares/auth.middleware';

const router = Router();
const controller = new DashboardController();

// Get dashboard stats
router.get('/stats', authMiddleware, async (req: AuthRequest, res) => {
  const result = await controller.getStats();
  res.json(result);
});

export default router;
