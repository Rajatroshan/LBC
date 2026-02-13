import { Router } from 'express';
import { ExpenseController } from '../controllers/expense.controller';
import { authMiddleware, adminMiddleware, AuthRequest } from '../middlewares/auth.middleware';

const router = Router();
const controller = new ExpenseController();

// Get all expenses
router.get('/', authMiddleware, async (req: AuthRequest, res) => {
  const filter = {
    festivalId: req.query.festivalId as string,
    category: req.query.category as string,
    startDate: req.query.startDate ? new Date(req.query.startDate as string) : undefined,
    endDate: req.query.endDate ? new Date(req.query.endDate as string) : undefined,
  };
  
  const result = await controller.getAllExpenses(filter);
  res.json(result);
});

// Get total expenses by festival
router.get('/festival/:festivalId/total', authMiddleware, async (req: AuthRequest, res) => {
  const result = await controller.getTotalExpensesByFestival(req.params.festivalId);
  res.json(result);
});

// Get expense by ID
router.get('/:id', authMiddleware, async (req: AuthRequest, res) => {
  const result = await controller.getExpenseById(req.params.id);
  res.json(result);
});

// Create expense (admin only)
router.post('/', authMiddleware, adminMiddleware, async (req: AuthRequest, res) => {
  const result = await controller.createExpense(req.body);
  res.json(result);
});

// Update expense (admin only)
router.put('/:id', authMiddleware, adminMiddleware, async (req: AuthRequest, res) => {
  const result = await controller.updateExpense(req.params.id, req.body);
  res.json(result);
});

// Delete expense (admin only)
router.delete('/:id', authMiddleware, adminMiddleware, async (req: AuthRequest, res) => {
  const result = await controller.deleteExpense(req.params.id);
  res.json(result);
});

export default router;
