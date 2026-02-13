import { Router } from 'express';
import { FamilyController } from '../controllers/family.controller';
import { authMiddleware, adminMiddleware, AuthRequest } from '../middlewares/auth.middleware';

const router = Router();
const controller = new FamilyController();

// Get all families (authenticated users)
router.get('/', authMiddleware, async (req: AuthRequest, res) => {
  const filter = {
    search: req.query.search as string,
    isActive: req.query.isActive === 'true' ? true : req.query.isActive === 'false' ? false : undefined,
  };
  
  const result = await controller.getAllFamilies(filter);
  res.json(result);
});

// Get family by ID (authenticated users)
router.get('/:id', authMiddleware, async (req: AuthRequest, res) => {
  const result = await controller.getFamilyById(req.params.id);
  res.json(result);
});

// Create family (admin only)
router.post('/', authMiddleware, adminMiddleware, async (req: AuthRequest, res) => {
  const result = await controller.createFamily(req.body);
  res.json(result);
});

// Update family (admin only)
router.put('/:id', authMiddleware, adminMiddleware, async (req: AuthRequest, res) => {
  const result = await controller.updateFamily(req.params.id, req.body);
  res.json(result);
});

// Delete family (admin only)
router.delete('/:id', authMiddleware, adminMiddleware, async (req: AuthRequest, res) => {
  const result = await controller.deleteFamily(req.params.id);
  res.json(result);
});

// Get active families count
router.get('/stats/active-count', authMiddleware, async (req: AuthRequest, res) => {
  const result = await controller.getActiveFamiliesCount();
  res.json(result);
});

export default router;
