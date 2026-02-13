import * as functions from 'firebase-functions';
import express, { Request, Response } from 'express';
import cors from 'cors';

// Import routes
import authRoutes from './routes/auth.routes';
import familyRoutes from './routes/family.routes';
import festivalRoutes from './routes/festival.routes';
import paymentRoutes from './routes/payment.routes';
import expenseRoutes from './routes/expense.routes';
import dashboardRoutes from './routes/dashboard.routes';

// Create Express app
const app = express();

// Middleware
app.use(cors({ origin: true }));
app.use(express.json());

// Health check
app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/families', familyRoutes);
app.use('/api/festivals', festivalRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Export Express app as Firebase Function
export const api = functions.https.onRequest(app);
