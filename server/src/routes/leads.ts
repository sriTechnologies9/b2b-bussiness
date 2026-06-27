import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, AuthenticatedRequest, JWT_SECRET } from '../middleware/auth';
import jwt from 'jsonwebtoken';


const router = Router();
const prisma = new PrismaClient();

// Helper for Mock AI Lead Scoring
function scoreLeadMessage(message: string): { score: 'HOT' | 'WARM' | 'COLD'; reason: string } {
  const msgLower = message.toLowerCase();
  
  // Urgent indicators -> HOT
  if (
    msgLower.includes('urgent') ||
    msgLower.includes('emergency') ||
    msgLower.includes('immediately') ||
    msgLower.includes('asap') ||
    msgLower.includes('this week') ||
    msgLower.includes('tomorrow') ||
    msgLower.includes('right now') ||
    msgLower.includes('installation next weekend')
  ) {
    return {
      score: 'HOT',
      reason: 'Lead expresses immediate urgency or specific fast-approaching scheduling constraints.'
    };
  }

  // Exploratory/Vague indicators -> COLD
  if (
    msgLower.includes('exploring') ||
    msgLower.includes('just checking') ||
    msgLower.includes('pricing options') ||
    msgLower.includes('not sure') ||
    msgLower.includes('next year') ||
    msgLower.includes('in future') ||
    msgLower.includes('general enquiry')
  ) {
    return {
      score: 'COLD',
      reason: 'Lead represents early-stage exploration, general information seeking, or lacks clear intent/budget.'
    };
  }

  // Default -> WARM
  return {
    score: 'WARM',
    reason: 'Lead provides a clear description of the requirement with moderate intent, but no strict urgency.'
  };
}

// Helper to enrich leads with registered user info (by matching phone number)
async function enrichLeadsWithUserData(leads: any[]) {
  const phones = leads.map(l => l.phone).filter(Boolean);
  const users = await prisma.user.findMany({
    where: { phone: { in: phones } },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      createdAt: true,
      subscription: {
        select: { plan: true }
      },
      _count: {
        select: {
          reviews: true,
          rfqs: true
        }
      }
    }
  });

  const userMap = new Map();
  users.forEach(u => {
    if (u.phone) {
      userMap.set(u.phone, u);
    }
  });

  return leads.map(lead => {
    const matchedUser = userMap.get(lead.phone);
    return {
      ...lead,
      registeredUser: matchedUser ? {
        id: matchedUser.id,
        name: matchedUser.name,
        email: matchedUser.email,
        role: matchedUser.role,
        plan: matchedUser.subscription?.plan || 'FREE',
        createdAt: matchedUser.createdAt,
        reviewsCount: matchedUser._count.reviews,
        rfqsCount: matchedUser._count.rfqs
      } : null
    };
  });
}

async function enrichLeadWithUserData(lead: any) {
  const enriched = await enrichLeadsWithUserData([lead]);
  return enriched[0];
}

// POST /api/leads - Customer submits a lead (requires authentication)
router.post('/', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    const { businessId, customerName, phone, message } = req.body;

    if (!businessId || !customerName || !phone || !message) {
      return res.status(400).json({ error: 'Missing required lead details' });
    }

    const business = await prisma.business.findUnique({ where: { id: businessId } });
    if (!business) {
      return res.status(404).json({ error: 'Business listing not found' });
    }

    // Run AI Lead Scorer
    const { score, reason } = scoreLeadMessage(message);

    const lead = await prisma.lead.create({
      data: {
        businessId,
        customerName,
        phone,
        message,
        score,
        scoreReason: reason,
        status: 'NEW'
      }
    });

    return res.status(201).json(lead);
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to submit lead: ' + error.message });
  }
});

// GET /api/leads/my-inquiries - Fetch leads submitted by current customer
router.get('/my-inquiries', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

    // Fetch user to get their phone number
    const user = await prisma.user.findUnique({
      where: { id: req.user.id }
    });

    if (!user || !user.phone) {
      return res.json([]);
    }

    const inquiries = await prisma.lead.findMany({
      where: { phone: user.phone },
      include: {
        business: {
          select: {
            name: true,
            slug: true,
            city: true,
            phone: true,
            whatsapp: true,
            category: {
              select: {
                name: true
              }
            },
            user: {
              select: {
                name: true
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return res.json(inquiries);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// GET /api/leads/business/:businessId - Fetch leads for business owner
router.get('/business/:businessId', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { businessId } = req.params;
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

    const business = await prisma.business.findUnique({
      where: { id: businessId }
    });

    if (!business) {
      return res.status(404).json({ error: 'Business listing not found' });
    }

    // Owner or Admin only
    if (business.userId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Forbidden: You do not own this listing' });
    }

    const leads = await prisma.lead.findMany({
      where: { businessId },
      orderBy: { createdAt: 'desc' }
    });

    const enrichedLeads = await enrichLeadsWithUserData(leads);
    return res.json(enrichedLeads);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// PUT /api/leads/:id/status - Update lead status (CRM action)
router.put('/:id/status', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // NEW, CONTACTED, CONVERTED, CLOSED

    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }

    const lead = await prisma.lead.findUnique({
      where: { id },
      include: { business: true }
    });

    if (!lead) {
      return res.status(404).json({ error: 'Lead not found' });
    }

    // Auth check
    if (!req.user || (lead.business.userId !== req.user.id && req.user.role !== 'ADMIN')) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const updated = await prisma.lead.update({
      where: { id },
      data: { status }
    });

    const enriched = await enrichLeadWithUserData(updated);
    return res.json(enriched);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// POST /api/leads/:id/rescore - Re-run AI lead scorer manually
router.post('/:id/rescore', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const lead = await prisma.lead.findUnique({
      where: { id },
      include: { business: true }
    });

    if (!lead) return res.status(404).json({ error: 'Lead not found' });
    if (!req.user || (lead.business.userId !== req.user.id && req.user.role !== 'ADMIN')) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const { score, reason } = scoreLeadMessage(lead.message);

    const updated = await prisma.lead.update({
      where: { id },
      data: {
        score,
        scoreReason: reason
      }
    });

    const enriched = await enrichLeadWithUserData(updated);
    return res.json(enriched);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// POST /api/leads/track - Public endpoint to track storefront actions (visits, clicks)
router.post('/track', async (req: Request, res: Response) => {
  try {
    const { businessId, action } = req.body; // action: 'visit' | 'whatsapp' | 'phone'

    if (!businessId || !action) {
      return res.status(400).json({ error: 'Missing businessId or action type' });
    }

    const business = await prisma.business.findUnique({ where: { id: businessId } });
    if (!business) {
      return res.status(404).json({ error: 'Business listing not found' });
    }

    // Try to decode optional auth token to identify logged-in users
    let customerName = 'Anonymous Visitor';
    let phone = 'N/A';
    
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (token) {
      try {
        const decoded = jwt.verify(token, JWT_SECRET) as any;
        if (decoded && decoded.id) {
          const dbUser = await prisma.user.findUnique({
            where: { id: decoded.id }
          });
          if (dbUser) {
            customerName = dbUser.name;
            phone = dbUser.phone || 'N/A';
          }
        }
      } catch (jwtErr: any) {
        // Token was invalid or expired, fallback to guest
        console.warn('Optional JWT verification failed for lead tracking:', jwtErr.message);
      }
    }

    // Determine details based on action type
    let message = '';
    let score: 'HOT' | 'WARM' | 'COLD' = 'COLD';
    let scoreReason = '';

    if (action === 'visit') {
      message = 'Customer opened your shop page 🏠';
      score = 'COLD';
      scoreReason = 'Customer opened your shop profile page.';
    } else if (action === 'whatsapp') {
      message = 'Clicked to chat with you on WhatsApp 💬';
      score = 'WARM';
      scoreReason = 'Clicked direct WhatsApp contact button.';
    } else if (action === 'phone') {
      message = 'Clicked to see your phone number 📞';
      score = 'WARM';
      scoreReason = 'Clicked to reveal or call your phone number.';
    } else {
      return res.status(400).json({ error: 'Invalid action type' });
    }

    const lead = await prisma.lead.create({
      data: {
        businessId,
        customerName,
        phone,
        message,
        score,
        scoreReason,
        status: 'NEW'
      }
    });

    const enriched = await enrichLeadWithUserData(lead);
    return res.status(201).json(enriched);
  } catch (error: any) {
    console.error('Lead tracking error:', error);
    return res.status(500).json({ error: 'Failed to track lead action: ' + error.message });
  }
});

export default router;
