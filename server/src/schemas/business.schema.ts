import { z } from 'zod';

export const createCategorySchema = z.object({
  body: z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    icon: z.string().min(2, "Icon name is required")
  })
});

export const createBusinessSchema = z.object({
  body: z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    categoryId: z.string().optional(),
    categoryName: z.string().optional(),
    description: z.string().min(10, "Description must be at least 10 characters"),
    address: z.string().min(5, "Address must be at least 5 characters"),
    city: z.string().min(2, "City is required"),
    state: z.string().min(2, "State is required"),
    latitude: z.union([z.number(), z.string()]).optional(),
    longitude: z.union([z.number(), z.string()]).optional(),
    phone: z.string().min(5, "Phone is required"),
    email: z.string().email("Invalid email"),
    whatsapp: z.string().optional(),
    website: z.string().optional(),
    hours: z.any().optional(),
    gallery: z.string().optional(),
    status: z.string().optional()
  }).refine(data => data.categoryId || data.categoryName, {
    message: "Either categoryId or categoryName must be provided",
    path: ["categoryId"]
  })
});

export const updateBusinessSchema = z.object({
  body: z.object({
    name: z.string().min(2).optional(),
    categoryId: z.string().optional(),
    categoryName: z.string().optional(),
    description: z.string().min(10).optional(),
    address: z.string().min(5).optional(),
    city: z.string().min(2).optional(),
    state: z.string().min(2).optional(),
    latitude: z.union([z.number(), z.string()]).optional(),
    longitude: z.union([z.number(), z.string()]).optional(),
    phone: z.string().min(5).optional(),
    email: z.string().email().optional(),
    whatsapp: z.string().optional(),
    website: z.string().optional(),
    hours: z.any().optional(),
    gallery: z.string().optional(),
    status: z.string().optional()
  })
});

export const createProductSchema = z.object({
  body: z.object({
    businessId: z.string().uuid("Valid Business ID is required"),
    name: z.string().min(2, "Name is required"),
    description: z.string().min(5, "Description is required"),
    price: z.union([z.number(), z.string()]),
    image: z.string().optional(),
    isOffer: z.boolean().optional(),
    offerDiscount: z.string().optional()
  })
});

export const updateProductSchema = z.object({
  body: z.object({
    name: z.string().min(2).optional(),
    description: z.string().min(5).optional(),
    price: z.union([z.number(), z.string()]).optional(),
    image: z.string().optional(),
    isOffer: z.boolean().optional(),
    offerDiscount: z.string().optional()
  })
});
