import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { authMiddleware, adminMiddleware, AuthRequest } from '../middlewares/auth.middleware';

const router = Router();
const controller = new AuthController();

// Register new user (admin only)
router.post('/register', authMiddleware, adminMiddleware, async (req: AuthRequest, res) => {
  const result = await controller.register(req.body);
  res.json(result);
});

// Get current user
router.get('/me', authMiddleware, async (req: AuthRequest, res) => {
  const result = await controller.getUserById(req.user!.uid);
  res.json(result);
});

// Get user by ID (admin only)
router.get('/users/:uid', authMiddleware, adminMiddleware, async (req: AuthRequest, res) => {
  const result = await controller.getUserById(req.params.uid);
  res.json(result);
});

// Update user (admin only or own profile)
router.put('/users/:uid', authMiddleware, async (req: AuthRequest, res) => {
  // Users can only update their own profile, admins can update any
  if (req.user!.uid !== req.params.uid && req.user!.role !== 'ADMIN') {
    res.status(403).json({ error: 'Forbidden' });
    return;
  }
  
  const result = await controller.updateUser(req.params.uid, req.body);
  res.json(result);
});

// Delete user (admin only)
router.delete('/users/:uid', authMiddleware, adminMiddleware, async (req: AuthRequest, res) => {
  const result = await controller.deleteUser(req.params.uid);
  res.json(result);
});

export default router;
