import { z } from 'zod';

export const createReviewSchema = z.object({
  businessId: z.string().uuid("Invalid business ID"),
  rating: z.union([z.number(), z.string()]).transform(val => Number(val)).refine(val => val >= 1 && val <= 5, {
    message: "Rating must be an integer between 1 and 5",
  }),
  comment: z.string().min(3, "Comment must be at least 3 characters").max(1000, "Comment cannot exceed 1000 characters")
});
