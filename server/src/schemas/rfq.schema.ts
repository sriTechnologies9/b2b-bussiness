import { z } from 'zod';

export const createRfqSchema = z.object({
  categoryId: z.string().uuid("Invalid category ID"),
  title: z.string().min(5, "Title must be at least 5 characters").max(100, "Title cannot exceed 100 characters"),
  message: z.string().min(10, "Message must be at least 10 characters").max(2000, "Message cannot exceed 2000 characters"),
  budget: z.union([z.number(), z.string()]).transform(val => Number(val)).refine(val => !isNaN(val) && val >= 0, {
    message: "Budget must be a positive number",
  }).optional().nullable(),
  city: z.string().min(2, "City must be at least 2 characters").max(50, "City cannot exceed 50 characters")
});

export const submitProposalSchema = z.object({
  businessId: z.string().uuid("Invalid business ID"),
  price: z.union([z.number(), z.string()]).transform(val => Number(val)).refine(val => !isNaN(val) && val > 0, {
    message: "Price must be a positive number greater than 0",
  }),
  message: z.string().min(10, "Message must be at least 10 characters").max(1000, "Message cannot exceed 1000 characters")
});
