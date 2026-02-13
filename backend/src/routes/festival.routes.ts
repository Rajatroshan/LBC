import { Router } from 'express';
import { FestivalController } from '../controllers/festival.controller';
import { authMiddleware, adminMiddleware, AuthRequest } from '../middlewares/auth.middleware';

const router = Router();
const controller = new FestivalController();

// Get all festivals
router.get('/', authMiddleware, async (req: AuthRequest, res) => {
  const filter = {
    search: req.query.search as string,
    year: req.query.year ? parseInt(req.query.year as string) : undefined,
    type: req.query.type as string,
    isActive: req.query.isActive === 'true' ? true : req.query.isActive === 'false' ? false : undefined,
  };
  
  const result = await controller.getAllFestivals(filter);
  res.json(result);
});

// Get upcoming festivals
router.get('/upcoming', authMiddleware, async (req: AuthRequest, res) => {
  const limit = req.query.limit ? parseInt(req.query.limit as string) : 5;
  const result = await controller.getUpcomingFestivals(limit);
  res.json(result);
});

// Get festival by ID
router.get('/:id', authMiddleware, async (req: AuthRequest, res) => {
  const result = await controller.getFestivalById(req.params.id);
  res.json(result);
});

// Create festival (admin only)
router.post('/', authMiddleware, adminMiddleware, async (req: AuthRequest, res) => {
  const result = await controller.createFestival(req.body);
  res.json(result);
});

// Update festival (admin only)
router.put('/:id', authMiddleware, adminMiddleware, async (req: AuthRequest, res) => {
  const result = await controller.updateFestival(req.params.id, req.body);
  res.json(result);
});

// Delete festival (admin only)
router.delete('/:id', authMiddleware, adminMiddleware, async (req: AuthRequest, res) => {
  const result = await controller.deleteFestival(req.params.id);
  res.json(result);
});

export default router;
