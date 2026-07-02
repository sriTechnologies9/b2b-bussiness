import { z } from 'zod';

export const createLeadSchema = z.object({
  body: z.object({
    businessId: z.string().uuid("Valid business ID required"),
    customerName: z.string().min(2, "Customer name is required"),
    phone: z.string().min(5, "Phone is required"),
    message: z.string().min(5, "Message is required")
  })
});

export const updateLeadStatusSchema = z.object({
  body: z.object({
    status: z.enum(['NEW', 'CONTACTED', 'CONVERTED', 'CLOSED'])
  })
});

export const trackLeadSchema = z.object({
  body: z.object({
    businessId: z.string().uuid("Valid business ID required"),
    action: z.enum(['visit', 'whatsapp', 'phone'])
  })
});
