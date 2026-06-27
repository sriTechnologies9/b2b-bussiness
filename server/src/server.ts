import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Import routes
import authRoutes from './routes/auth';
import businessRoutes from './routes/businesses';
import leadRoutes from './routes/leads';
import reviewRoutes from './routes/reviews';
import subscriptionRoutes from './routes/subscriptions';
import rfqRoutes from './routes/rfqs';
import adminRoutes from './routes/admin';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: '*', // Allow all origins for local testing convenience
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/businesses', businessRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/rfqs', rfqRoutes);
app.use('/api/admin', adminRoutes);

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// Health Check
app.get('/api/clean-db-secret', async (req: Request, res: Response) => {
  try {
    const proposalDel = await prisma.proposal.deleteMany({});
    const productDel = await prisma.product.deleteMany({});
    const leadDel = await prisma.lead.deleteMany({});
    const reviewDel = await prisma.review.deleteMany({});
    const rfqDel = await prisma.rfq.deleteMany({});
    const dealerRequestDel = await prisma.dealerRequest.deleteMany({});

    const adminUsers = await prisma.user.findMany({
      where: { role: 'ADMIN' }
    });
    const adminIds = adminUsers.map(u => u.id);

    const subDel = await prisma.subscription.deleteMany({
      where: { userId: { notIn: adminIds } }
    });

    const bizDel = await prisma.business.deleteMany({});

    const userDel = await prisma.user.deleteMany({
      where: { role: { not: 'ADMIN' } }
    });

    res.json({
      success: true,
      message: 'Database cleaned successfully',
      deleted: {
        proposals: proposalDel.count,
        products: productDel.count,
        leads: leadDel.count,
        reviews: reviewDel.count,
        rfqs: rfqDel.count,
        dealerRequests: dealerRequestDel.count,
        subscriptions: subDel.count,
        businesses: bizDel.count,
        users: userDel.count
      }
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

// Global Error Handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error: ' + err.message });
});

app.listen(PORT, () => {
  console.log(`LocalConnect Server running on port ${PORT}`);
});
