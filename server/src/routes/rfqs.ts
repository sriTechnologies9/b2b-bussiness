import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, AuthenticatedRequest, requireRole } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { createRfqSchema, submitProposalSchema } from '../schemas/rfq.schema';

const router = Router();
const prisma = new PrismaClient();

// POST /api/rfqs - Submit a new RFQ (requires CUSTOMER auth)
router.post('/', authenticateToken, requireRole(['CUSTOMER', 'OWNER', 'ADMIN']), validate(createRfqSchema), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { categoryId, title, message, budget, city } = req.body;
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

    const rfq = await prisma.rfq.create({
      data: {
        customerId: req.user.id,
        categoryId,
        title,
        message,
        budget: budget ? parseFloat(budget) : null,
        city,
        status: 'OPEN'
      }
    });

    return res.status(201).json(rfq);
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to create RFQ: ' + error.message });
  }
});

// GET /api/rfqs/my-rfqs - Get RFQs posted by current customer (requires CUSTOMER auth)
router.get('/my-rfqs', authenticateToken, requireRole(['CUSTOMER', 'OWNER', 'ADMIN']), async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

    const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;
    const page = req.query.page ? parseInt(req.query.page as string) : 1;
    const skip = (page - 1) * limit;

    const rfqs = await prisma.rfq.findMany({
      where: { customerId: req.user.id },
      include: {
        category: true,
        proposals: {
          include: {
            business: {
              select: {
                name: true,
                phone: true,
                email: true
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit
    });

    return res.json(rfqs);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// GET /api/rfqs/market - Get all open RFQs matching the dealer's business categories (requires OWNER/ADMIN auth)
router.get('/market', authenticateToken, requireRole(['OWNER', 'ADMIN']), async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

    // Find all categories associated with the owner's businesses
    const ownerBusinesses = await prisma.business.findMany({
      where: { userId: req.user.id }
    });

    const categoryIds = ownerBusinesses.map(b => b.categoryId);

    const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;
    const page = req.query.page ? parseInt(req.query.page as string) : 1;
    const skip = (page - 1) * limit;

    // Get all OPEN RFQs matching these categories
    const rfqs = await prisma.rfq.findMany({
      where: {
        categoryId: { in: categoryIds },
        status: 'OPEN'
      },
      include: {
        category: true,
        customer: {
          select: {
            name: true
          }
        },
        proposals: {
          where: {
            businessId: { in: ownerBusinesses.map(b => b.id) }
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit
    });

    return res.json(rfqs);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// POST /api/rfqs/:id/proposals - Submit a proposal/bid for an RFQ (requires OWNER/ADMIN auth)
router.post('/:id/proposals', authenticateToken, requireRole(['OWNER', 'ADMIN']), validate(submitProposalSchema), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { businessId, price, message } = req.body;
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

    // Verify the business belongs to the owner
    const business = await prisma.business.findFirst({
      where: { id: businessId, userId: req.user.id }
    });

    if (!business) {
      return res.status(403).json({ error: 'Forbidden: You do not own this business listing' });
    }

    const rfq = await prisma.rfq.findUnique({ where: { id } });
    if (!rfq) {
      return res.status(404).json({ error: 'RFQ not found' });
    }

    if (rfq.status !== 'OPEN') {
      return res.status(400).json({ error: 'This RFQ is already closed' });
    }

    // Check if proposal already submitted for this business
    const existing = await prisma.proposal.findFirst({
      where: { rfqId: id, businessId }
    });

    if (existing) {
      return res.status(400).json({ error: 'You have already submitted a quote for this RFQ using this business' });
    }

    const proposal = await prisma.proposal.create({
      data: {
        rfqId: id,
        businessId,
        price: parseFloat(price),
        message,
        status: 'PENDING'
      }
    });

    return res.status(201).json(proposal);
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to submit proposal: ' + error.message });
  }
});

// POST /api/rfqs/proposals/:id/accept - Accept a specific proposal (requires CUSTOMER auth)
router.post('/proposals/:id/accept', authenticateToken, requireRole(['CUSTOMER', 'OWNER', 'ADMIN']), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

    const proposal = await prisma.proposal.findUnique({
      where: { id },
      include: { rfq: true }
    });

    if (!proposal) {
      return res.status(404).json({ error: 'Proposal not found' });
    }

    // Verify the RFQ belongs to the user
    if (proposal.rfq.customerId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Forbidden: You did not post this RFQ' });
    }

    // Accept this proposal
    const updatedProposal = await prisma.proposal.update({
      where: { id },
      data: { status: 'ACCEPTED' }
    });

    // Reject all other proposals for this RFQ
    await prisma.proposal.updateMany({
      where: {
        rfqId: proposal.rfqId,
        id: { not: id }
      },
      data: { status: 'REJECTED' }
    });

    // Close the RFQ
    await prisma.rfq.update({
      where: { id: proposal.rfqId },
      data: { status: 'CLOSED' }
    });

    return res.json({ success: true, proposal: updatedProposal });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to accept proposal: ' + error.message });
  }
});

// DELETE /api/rfqs/:id - Delete an RFQ (requires CUSTOMER or ADMIN auth)
router.delete('/:id', authenticateToken, requireRole(['CUSTOMER', 'OWNER', 'ADMIN']), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

    const rfq = await prisma.rfq.findUnique({
      where: { id }
    });

    if (!rfq) {
      return res.status(404).json({ error: 'RFQ not found' });
    }

    // Verify ownership or admin role
    if (rfq.customerId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Forbidden: You do not own this RFQ' });
    }

    // Delete the RFQ (cascade deletes handle Proposals)
    await prisma.rfq.delete({
      where: { id }
    });

    return res.json({ success: true, message: 'RFQ deleted successfully' });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to delete RFQ: ' + error.message });
  }
});

export default router;

