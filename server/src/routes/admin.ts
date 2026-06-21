import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, AuthenticatedRequest, requireRole } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// All routes here require ADMIN role
const adminAuth = [authenticateToken, requireRole(['ADMIN'])];

// GET /api/admin/users - List all users with pagination
router.get('/users', ...adminAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50;
    const search = req.query.search as string || '';
    const role = req.query.role as string || '';

    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { email: { contains: search } },
        { phone: { contains: search } }
      ];
    }

    if (role && role !== 'ALL') {
      where.role = role;
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          role: true,
          createdAt: true,
          subscription: {
            select: { plan: true, expiryDate: true }
          },
          _count: {
            select: {
              businesses: true,
              reviews: true,
              rfqs: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit
      }),
      prisma.user.count({ where })
    ]);

    return res.json({
      users,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// PUT /api/admin/users/:id/role - Change user role
router.put('/users/:id/role', ...adminAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!role || !['CUSTOMER', 'OWNER', 'ADMIN'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role. Must be CUSTOMER, OWNER, or ADMIN' });
    }

    // Prevent admin from changing their own role
    if (req.user && req.user.id === id) {
      return res.status(400).json({ error: 'Cannot change your own role' });
    }

    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if ((role === 'OWNER' || role === 'ADMIN') && !user.email.toLowerCase().endsWith('@compaanynamedelaerss.com')) {
      return res.status(400).json({ error: 'Access Denied: User email must end with @compaanynamedelaerss.com to be assigned a Dealer/Admin role.' });
    }

    if (role === 'ADMIN' && user.role !== 'ADMIN') {
      const adminCount = await prisma.user.count({ where: { role: 'ADMIN' } });
      if (adminCount >= 2) {
        return res.status(400).json({ error: 'System limit reached: Maximum of 2 Admin profiles allowed.' });
      }
    }

    const updated = await prisma.user.update({
      where: { id },
      data: { role },
      select: { id: true, name: true, email: true, role: true }
    });

    return res.json({ success: true, user: updated });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// DELETE /api/admin/users/:id - Delete a user
router.delete('/users/:id', ...adminAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;

    // Prevent self-deletion
    if (req.user && req.user.id === id) {
      return res.status(400).json({ error: 'Cannot delete your own account' });
    }

    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    await prisma.user.delete({ where: { id } });

    return res.json({ success: true, message: `User ${user.email} deleted successfully` });
  } catch (error: any) {
    return res.status(500).json({ error: 'Failed to delete user: ' + error.message });
  }
});

// GET /api/admin/rfqs - List all RFQs
router.get('/rfqs', ...adminAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const status = req.query.status as string || '';

    const where: any = {};
    if (status && status !== 'ALL') {
      where.status = status;
    }

    const rfqs = await prisma.rfq.findMany({
      where,
      include: {
        customer: {
          select: { name: true, email: true }
        },
        category: {
          select: { name: true }
        },
        proposals: {
          select: {
            id: true,
            price: true,
            status: true,
            business: {
              select: { name: true }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return res.json(rfqs);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// GET /api/admin/reviews - List all reviews
router.get('/reviews', ...adminAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const reviews = await prisma.review.findMany({
      include: {
        user: {
          select: { name: true, email: true }
        },
        business: {
          select: { name: true, slug: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return res.json(reviews);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// DELETE /api/admin/reviews/:id - Delete a review (moderation)
router.delete('/reviews/:id', ...adminAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;

    const review = await prisma.review.findUnique({ where: { id } });
    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }

    await prisma.review.delete({ where: { id } });

    return res.json({ success: true, message: 'Review deleted successfully' });
  } catch (error: any) {
    return res.status(500).json({ error: 'Failed to delete review: ' + error.message });
  }
});

// GET /api/admin/stats - Platform analytics
router.get('/stats', ...adminAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const [
      totalUsers,
      totalBusinesses,
      totalLeads,
      totalRfqs,
      totalReviews,
      totalProducts,
      newUsersThisMonth,
      newUsersThisWeek,
      newBusinessesThisMonth,
      newLeadsThisMonth,
      openRfqs,
      verifiedBusinesses,
      pendingBusinesses,
      usersByRole,
      subscriptionsByPlan,
      leadsByScore
    ] = await Promise.all([
      prisma.user.count(),
      prisma.business.count(),
      prisma.lead.count(),
      prisma.rfq.count(),
      prisma.review.count(),
      prisma.product.count(),
      prisma.user.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
      prisma.user.count({ where: { createdAt: { gte: sevenDaysAgo } } }),
      prisma.business.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
      prisma.lead.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
      prisma.rfq.count({ where: { status: 'OPEN' } }),
      prisma.business.count({ where: { status: 'VERIFIED' } }),
      prisma.business.count({ where: { status: 'PENDING' } }),
      prisma.user.groupBy({ by: ['role'], _count: true }),
      prisma.subscription.groupBy({ by: ['plan'], _count: true }),
      prisma.lead.groupBy({ by: ['score'], _count: true })
    ]);

    return res.json({
      overview: {
        totalUsers,
        totalBusinesses,
        totalLeads,
        totalRfqs,
        totalReviews,
        totalProducts
      },
      growth: {
        newUsersThisMonth,
        newUsersThisWeek,
        newBusinessesThisMonth,
        newLeadsThisMonth
      },
      status: {
        openRfqs,
        verifiedBusinesses,
        pendingBusinesses
      },
      breakdown: {
        usersByRole: usersByRole.reduce((acc: any, r: any) => { acc[r.role] = r._count; return acc; }, {}),
        subscriptionsByPlan: subscriptionsByPlan.reduce((acc: any, s: any) => { acc[s.plan] = s._count; return acc; }, {}),
        leadsByScore: leadsByScore.reduce((acc: any, l: any) => { acc[l.score] = l._count; return acc; }, {})
      }
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// GET /api/admin/dealer-requests - List all dealer requests
router.get('/dealer-requests', ...adminAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const requests = await prisma.dealerRequest.findMany({
      include: {
        user: {
          select: { name: true, email: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    return res.json(requests);
  } catch (error: any) {
    return res.status(500).json({ error: 'Failed to retrieve dealer requests: ' + error.message });
  }
});

// POST /api/admin/dealer-requests/:id/approve - Approve request, create OWNER account and Business storefront
router.post('/dealer-requests/:id/approve', ...adminAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;

    const request = await prisma.dealerRequest.findUnique({
      where: { id }
    });

    if (!request) {
      return res.status(404).json({ error: 'Dealer request not found.' });
    }

    if (request.status !== 'PENDING') {
      return res.status(400).json({ error: 'Request has already been processed.' });
    }

    // 1. Generate unique email ending in @compaanynamedelaerss.com
    // Sanitize business name for email username
    const sanitizedBizName = request.businessName
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '');
    
    // Add random suffix to avoid collisions
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const generatedEmail = `${sanitizedBizName}${randomSuffix}@compaanynamedelaerss.com`;

    // 2. Generate random password
    const generatedPass = `Dealer#${Math.floor(1000 + Math.random() * 9000)}`;

    // 3. Create OWNER user
    const newDealer = await prisma.user.create({
      data: {
        name: request.businessName + " Owner",
        email: generatedEmail,
        phone: request.contactPhone,
        password: generatedPass,
        role: 'OWNER'
      }
    });

    // 4. Create Business Storefront for the new dealer
    // Find category ID or dynamically create it if it does not exist
    let category = await prisma.category.findFirst({
      where: {
        name: { equals: request.categoryName }
      }
    });

    if (!category) {
      category = await prisma.category.findFirst({
        where: {
          name: { contains: request.categoryName }
        }
      });
    }

    if (!category) {
      // Dynamically create the category if not found
      const catSlug = request.categoryName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      category = await prisma.category.create({
        data: {
          name: request.categoryName,
          slug: catSlug,
          icon: 'Store'
        }
      });
    }

    const businessSlug = `${sanitizedBizName}-${randomSuffix}`;
    const workingHours = JSON.stringify({
      monday: '09:00 - 18:00',
      tuesday: '09:00 - 18:00',
      wednesday: '09:00 - 18:00',
      thursday: '09:00 - 18:00',
      friday: '09:00 - 18:00',
      saturday: '09:00 - 14:00',
      sunday: 'Closed'
    });

    await prisma.business.create({
      data: {
        userId: newDealer.id,
        name: request.businessName,
        slug: businessSlug,
        categoryId: category?.id || '',
        description: `Welcome to ${request.businessName}! We offer premium ${request.categoryName} services and products in your area. Contact us for custom quotes.`,
        address: 'Business Area Address',
        city: 'Hyderabad',
        state: 'Telangana',
        latitude: 17.3850,
        longitude: 78.4867,
        status: 'VERIFIED',
        phone: request.contactPhone,
        email: request.contactEmail,
        whatsapp: request.contactPhone,
        hours: workingHours,
        gallery: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=500'
      }
    });

    // 5. Create default Free Subscription
    await prisma.subscription.create({
      data: {
        userId: newDealer.id,
        plan: 'FREE',
        expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
      }
    });

    // 6. Update request status with credentials
    const updatedRequest = await prisma.dealerRequest.update({
      where: { id },
      data: {
        status: 'APPROVED',
        generatedEmail,
        generatedPass
      }
    });

    return res.json({ success: true, request: updatedRequest });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to approve request: ' + error.message });
  }
});

// POST /api/admin/dealer-requests/:id/reject - Reject dealer request
router.post('/dealer-requests/:id/reject', ...adminAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;

    const request = await prisma.dealerRequest.findUnique({ where: { id } });
    if (!request) {
      return res.status(404).json({ error: 'Dealer request not found.' });
    }

    if (request.status !== 'PENDING') {
      return res.status(400).json({ error: 'Request has already been processed.' });
    }

    const updatedRequest = await prisma.dealerRequest.update({
      where: { id },
      data: { status: 'REJECTED' }
    });

    return res.json({ success: true, request: updatedRequest });
  } catch (error: any) {
    return res.status(500).json({ error: 'Failed to reject request: ' + error.message });
  }
});

export default router;
