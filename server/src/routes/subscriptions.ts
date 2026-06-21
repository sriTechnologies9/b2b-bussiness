import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// GET /api/subscriptions/my-plan - Get current user subscription details
router.get('/my-plan', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

    const subscription = await prisma.subscription.findUnique({
      where: { userId: req.user.id }
    });

    if (!subscription) {
      return res.status(404).json({ error: 'No subscription found for this user' });
    }

    return res.json(subscription);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// POST /api/subscriptions/upgrade - Mock upgrade subscription plan (Checkout simulation)
router.post('/upgrade', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

    const { plan } = req.body; // FREE, BASIC, PRO, PREMIUM

    const validPlans = ['FREE', 'BASIC', 'PRO', 'PREMIUM'];
    if (!plan || !validPlans.includes(plan)) {
      return res.status(400).json({ error: 'Invalid plan name' });
    }

    const durationDays = 30; // standard month plan
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + durationDays);

    const subscription = await prisma.subscription.upsert({
      where: { userId: req.user.id },
      update: {
        plan,
        startDate: new Date(),
        expiryDate
      },
      create: {
        userId: req.user.id,
        plan,
        startDate: new Date(),
        expiryDate
      }
    });

    return res.json({
      success: true,
      message: `Successfully upgraded to ${plan} plan!`,
      subscription
    });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ error: 'Upgrade failed: ' + error.message });
  }
});

export default router;
