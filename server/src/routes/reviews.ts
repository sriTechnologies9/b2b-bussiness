import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { createReviewSchema } from '../schemas/review.schema';

const router = Router();
const prisma = new PrismaClient();

// POST /api/reviews - Submit review
router.post('/', authenticateToken, validate(createReviewSchema), async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

    const { businessId, rating, comment } = req.body;
    const rateVal = parseInt(rating);

    const business = await prisma.business.findUnique({ where: { id: businessId } });
    if (!business) {
      return res.status(404).json({ error: 'Business not found' });
    }

    // Optional: Prevent self-reviewing
    if (business.userId === req.user.id) {
      return res.status(400).json({ error: 'You cannot review your own business listing' });
    }

    // Prevent duplicate reviews from the same user for the same business
    const existingReview = await prisma.review.findFirst({
      where: {
        businessId,
        userId: req.user.id
      }
    });

    if (existingReview) {
      return res.status(400).json({ error: 'You have already submitted a review for this business' });
    }

    // Create review
    const review = await prisma.review.create({
      data: {
        businessId,
        userId: req.user.id,
        rating: rateVal,
        comment
      },
      include: {
        user: {
          select: {
            name: true
          }
        }
      }
    });

    return res.status(201).json(review);
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to submit review: ' + error.message });
  }
});

// GET /api/reviews/my-reviews - Fetch reviews submitted by current user
router.get('/my-reviews', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

    const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;
    const page = req.query.page ? parseInt(req.query.page as string) : 1;
    const skip = (page - 1) * limit;

    const reviews = await prisma.review.findMany({
      where: { userId: req.user.id },
      include: {
        business: {
          select: {
            name: true,
            slug: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit
    });

    return res.json(reviews);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// DELETE /api/reviews/:id - Delete review written by the user
router.delete('/:id', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    const { id } = req.params;

    const review = await prisma.review.findUnique({
      where: { id }
    });

    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }

    // Owner check: Only the user who wrote the review (or an admin) can delete it
    if (review.userId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Forbidden: You did not write this review' });
    }

    await prisma.review.delete({
      where: { id }
    });

    return res.json({ success: true, message: 'Review deleted successfully' });
  } catch (error: any) {
    return res.status(500).json({ error: 'Failed to delete review: ' + error.message });
  }
});

export default router;
