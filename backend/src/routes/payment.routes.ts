import { Router } from 'express';
import { PaymentController } from '../controllers/payment.controller';
import { authMiddleware, adminMiddleware, AuthRequest } from '../middlewares/auth.middleware';

const router = Router();
const controller = new PaymentController();

// Get all payments
router.get('/', authMiddleware, async (req: AuthRequest, res) => {
  const filter = {
    festivalId: req.query.festivalId as string,
    familyId: req.query.familyId as string,
    status: req.query.status as 'PAID' | 'UNPAID' | 'PENDING',
    startDate: req.query.startDate ? new Date(req.query.startDate as string) : undefined,
    endDate: req.query.endDate ? new Date(req.query.endDate as string) : undefined,
  };
  
  const result = await controller.getAllPayments(filter);
  res.json(result);
});

// Get recent payments
router.get('/recent', authMiddleware, async (req: AuthRequest, res) => {
  const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
  const result = await controller.getRecentPayments(limit);
  res.json(result);
});

// Get payments by festival
router.get('/festival/:festivalId', authMiddleware, async (req: AuthRequest, res) => {
  const result = await controller.getPaymentsByFestival(req.params.festivalId);
  res.json(result);
});

// Get payment by ID
router.get('/:id', authMiddleware, async (req: AuthRequest, res) => {
  const result = await controller.getPaymentById(req.params.id);
  res.json(result);
});

// Create payment (admin only)
router.post('/', authMiddleware, adminMiddleware, async (req: AuthRequest, res) => {
  const result = await controller.createPayment(req.body);
  res.json(result);
});

// Update payment (admin only)
router.put('/:id', authMiddleware, adminMiddleware, async (req: AuthRequest, res) => {
  const result = await controller.updatePayment(req.params.id, req.body);
  res.json(result);
});

// Delete payment (admin only)
router.delete('/:id', authMiddleware, adminMiddleware, async (req: AuthRequest, res) => {
  const result = await controller.deletePayment(req.params.id);
  res.json(result);
});

export default router;
