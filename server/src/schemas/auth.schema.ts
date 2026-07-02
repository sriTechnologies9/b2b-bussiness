import { z } from 'zod';

export const registerSchema = z.object({
  body: z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    phone: z.string().optional(),
    password: z.string().min(6, "Password must be at least 6 characters"),
    role: z.enum(['CUSTOMER', 'OWNER', 'ADMIN']).optional()
  })
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(1, "Password is required")
  })
});

export const updateProfileSchema = z.object({
  body: z.object({
    name: z.string().min(2, "Name must be at least 2 characters").optional(),
    email: z.string().email("Invalid email address").optional(),
    phone: z.string().optional()
  })
});

export const updatePasswordSchema = z.object({
  body: z.object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(6, "New password must be at least 6 characters")
  })
});

export const becomeDealerSchema = z.object({
  body: z.object({
    businessName: z.string().min(2, "Business name is required"),
    categoryName: z.string().min(2, "Category name is required"),
    contactEmail: z.string().email("Invalid email address"),
    contactPhone: z.string().min(5, "Contact phone is required")
  })
});
