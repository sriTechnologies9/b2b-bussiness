import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, AuthenticatedRequest, requireRole } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { createCategorySchema, createBusinessSchema, updateBusinessSchema, createProductSchema, updateProductSchema } from '../schemas/business.schema';
import fs, { promises as fsPromises } from 'fs';
import path from 'path';

const router = Router();
const prisma = new PrismaClient();

// Helper to make a URL slug
function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start
    .replace(/-+$/, '');            // Trim - from end
}

// GET /api/businesses/categories - Get all categories
router.get('/categories', async (req: Request, res: Response) => {
  try {
    let categories = await prisma.category.findMany();
    
    // Auto-seed default categories if database is empty
    if (categories.length === 0) {
      const defaultCats = [
        { name: 'Restaurants', slug: 'restaurants', icon: 'Utensils' },
        { name: 'Electricians', slug: 'electricians', icon: 'Zap' },
        { name: 'Plumbers', slug: 'plumbers', icon: 'Droplet' },
        { name: 'Clinics', slug: 'clinics', icon: 'Activity' },
        { name: 'Gyms', slug: 'gyms', icon: 'Dumbbell' },
        { name: 'Salons', slug: 'salons', icon: 'Scissors' },
        { name: 'CCTV Shops', slug: 'cctv-shops', icon: 'Camera' },
        { name: 'Real Estate', slug: 'real-estate', icon: 'Home' },
        { name: 'Retail Stores', slug: 'retail-stores', icon: 'ShoppingBag' }
      ];
      
      await prisma.category.createMany({
        data: defaultCats,
        skipDuplicates: true
      });
      
      categories = await prisma.category.findMany();
    }
    
    return res.json(categories);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// POST /api/businesses/categories - Create a new category (requires ADMIN auth)
router.post('/categories', authenticateToken, requireRole(['ADMIN']), validate(createCategorySchema), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { name, icon } = req.body;

    const slug = slugify(name);

    // Check if category name or slug already exists
    const existing = await prisma.category.findFirst({
      where: {
        OR: [
          { name },
          { slug }
        ]
      }
    });

    if (existing) {
      return res.status(400).json({ error: 'A category with this name or slug already exists' });
    }

    const category = await prisma.category.create({
      data: {
        name,
        slug,
        icon
      }
    });

    return res.status(201).json(category);
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to create category: ' + error.message });
  }
});

// GET /api/businesses/my-listings - Get current user's listings
router.get('/my-listings', authenticateToken, requireRole(['OWNER', 'ADMIN']), async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;
    const page = req.query.page ? parseInt(req.query.page as string) : 1;
    const skip = (page - 1) * limit;

    const listings = await prisma.business.findMany({
      where: { userId: req.user.id },
      include: { category: true },
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' }
    });
    return res.json(listings);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// GET /api/businesses - Search / List
router.get('/', async (req: Request, res: Response) => {
  try {
    const { category, city, query, status } = req.query;

    const whereClause: any = {};

    // Filter by status (default to VERIFIED for public queries)
    if (status) {
      if (status !== 'ALL') {
        whereClause.status = status as string;
      }
    } else {
      whereClause.status = 'VERIFIED';
    }

    if (category) {
      whereClause.category = { slug: category as string };
    }

    if (city) {
      whereClause.city = { contains: city as string }; // Case insensitive on sqlite
    }

    if (query) {
      whereClause.OR = [
        { name: { contains: query as string } },
        { description: { contains: query as string } },
        { address: { contains: query as string } }
      ];
    }

    const limitNum = req.query.limit ? parseInt(req.query.limit as string) : 20;
    const pageNum = req.query.page ? parseInt(req.query.page as string) : 1;
    const skip = (pageNum - 1) * limitNum;

    const businesses = await prisma.business.findMany({
      where: whereClause,
      include: {
        category: true,
        reviews: {
          select: {
            rating: true
          }
        }
      },
      skip,
      take: limitNum,
      orderBy: { createdAt: 'desc' }
    });

    // Map business to include average rating and review count
    const mapped = businesses.map(b => {
      const reviewCount = b.reviews.length;
      const averageRating = reviewCount > 0 
        ? parseFloat((b.reviews.reduce((acc, r) => acc + r.rating, 0) / reviewCount).toFixed(1))
        : 0;

      return {
        ...b,
        averageRating,
        reviewCount
      };
    });

    return res.json(mapped);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// GET /api/businesses/slug/:slug - Details by slug
router.get('/slug/:slug', async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const business = await prisma.business.findUnique({
      where: { slug },
      include: {
        category: true,
        reviews: {
          include: {
            user: {
              select: {
                name: true
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          }
        }
      }
    });

    if (!business) {
      return res.status(404).json({ error: 'Business not found' });
    }

    const reviewCount = business.reviews.length;
    const averageRating = reviewCount > 0 
      ? parseFloat((business.reviews.reduce((acc, r) => acc + r.rating, 0) / reviewCount).toFixed(1))
      : 0;

    // Parse follower stats from hours JSON metadata
    let hoursMap: any = {};
    try {
      hoursMap = typeof business.hours === 'string' ? JSON.parse(business.hours) : (business.hours || {});
    } catch (e) {
      hoursMap = {};
    }
    const followerCount = (hoursMap.followersList && Array.isArray(hoursMap.followersList)) 
      ? hoursMap.followersList.length 
      : 0;

    return res.json({
      ...business,
      averageRating,
      reviewCount,
      followerCount
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

router.post('/', authenticateToken, requireRole(['OWNER', 'ADMIN']), validate(createBusinessSchema), async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

    let { name, categoryId, categoryName, description, address, city, state, latitude, longitude, phone, email, whatsapp, website, hours, gallery } = req.body;

    // Resolve categoryId if categoryName is provided instead
    if (categoryName) {
      let category = await prisma.category.findFirst({
        where: { name: { equals: categoryName } }
      });
      if (!category) {
        category = await prisma.category.findFirst({
          where: { name: { contains: categoryName } }
        });
      }
      if (!category) {
        // Create category dynamically
        const catSlug = categoryName
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '');
        category = await prisma.category.create({
          data: {
            name: categoryName,
            slug: catSlug,
            icon: 'Store'
          }
        });
      }
      categoryId = category.id;
    }

    // Generate unique slug
    let baseSlug = slugify(name);
    let slug = baseSlug;
    let counter = 1;
    while (await prisma.business.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter++}`;
    }

    // Default hours if empty
    const defaultHours = JSON.stringify({
      monday: '09:00 - 18:00',
      tuesday: '09:00 - 18:00',
      wednesday: '09:00 - 18:00',
      thursday: '09:00 - 18:00',
      friday: '09:00 - 18:00',
      saturday: '09:00 - 18:00',
      sunday: 'Closed'
    });

    const business = await prisma.business.create({
      data: {
        userId: req.user.id,
        name,
        slug,
        categoryId,
        description,
        address,
        city,
        state,
        latitude: latitude ? parseFloat(latitude) : 17.3850, // default Hyderabad lat
        longitude: longitude ? parseFloat(longitude) : 78.4867, // default Hyderabad lng
        phone,
        email,
        whatsapp: whatsapp || '',
        website: website || '',
        hours: hours ? (typeof hours === 'string' ? hours : JSON.stringify(hours)) : defaultHours,
        gallery: gallery || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500', // default food/shop img
        status: 'PENDING'
      }
    });

    return res.status(201).json(business);
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to create business: ' + error.message });
  }
});

router.put('/:id', authenticateToken, requireRole(['OWNER', 'ADMIN']), validate(updateBusinessSchema), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

    const business = await prisma.business.findUnique({ where: { id } });
    if (!business) {
      return res.status(404).json({ error: 'Business not found' });
    }

    // Check ownership
    if (business.userId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Forbidden: You do not own this listing' });
    }

    const { name, categoryId, categoryName, description, address, city, state, latitude, longitude, phone, email, whatsapp, website, hours, gallery, status } = req.body;

    let targetCategoryId = categoryId;
    if (categoryName) {
      let category = await prisma.category.findFirst({
        where: { name: { equals: categoryName } }
      });
      if (!category) {
        category = await prisma.category.findFirst({
          where: { name: { contains: categoryName } }
        });
      }
      if (!category) {
        // Create category dynamically
        const catSlug = categoryName
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '');
        category = await prisma.category.create({
          data: {
            name: categoryName,
            slug: catSlug,
            icon: 'Store'
          }
        });
      }
      targetCategoryId = category.id;
    }

    const updated = await prisma.business.update({
      where: { id },
      data: {
        name: name !== undefined ? name : business.name,
        categoryId: targetCategoryId !== undefined ? targetCategoryId : business.categoryId,
        description: description !== undefined ? description : business.description,
        address: address !== undefined ? address : business.address,
        city: city !== undefined ? city : business.city,
        state: state !== undefined ? state : business.state,
        latitude: latitude !== undefined ? parseFloat(latitude) : business.latitude,
        longitude: longitude !== undefined ? parseFloat(longitude) : business.longitude,
        phone: phone !== undefined ? phone : business.phone,
        email: email !== undefined ? email : business.email,
        whatsapp: whatsapp !== undefined ? whatsapp : business.whatsapp,
        website: website !== undefined ? website : business.website,
        hours: hours !== undefined ? (typeof hours === 'string' ? hours : JSON.stringify(hours)) : business.hours,
        gallery: gallery !== undefined ? gallery : business.gallery,
        status: (status !== undefined && req.user.role === 'ADMIN') ? status : business.status
      }
    });

    return res.json(updated);
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to update business: ' + error.message });
  }
});

// POST /api/businesses/:id/verify - Mock verification
router.post('/:id/verify', authenticateToken, requireRole(['OWNER', 'ADMIN']), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const business = await prisma.business.findUnique({ where: { id } });
    if (!business) return res.status(404).json({ error: 'Business not found' });

    const updated = await prisma.business.update({
      where: { id },
      data: { status: 'VERIFIED' }
    });

    return res.json({ success: true, business: updated });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// POST /api/businesses/generate-description - Mock AI description generator
router.post('/generate-description', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  const { name, category, location } = req.body;
  if (!name || !category || !location) {
    return res.status(400).json({ error: 'Missing name, category, or location' });
  }

  // Realistic generated text depending on category
  const textTemplates: Record<string, string> = {
    restaurants: `Welcome to ${name}, the ultimate dining destination in ${location}! We specialize in authentic culinary creations crafted by our master chefs. Whether you are joining us for a casual lunch, a romantic dinner, or celebrating a special family occasion, ${name} offers a warm, inviting atmosphere paired with exceptional service. Come savor our signature dishes and experience why we are one of the most loved spots in ${location}.`,
    electricians: `Need a reliable electrical service in ${location}? Look no further than ${name}. We are your local, certified electrical experts handling everything from minor residential repairs and appliance installations to full-scale commercial wiring. At ${name}, customer safety and efficiency are our top priorities. We offer transparent pricing, prompt scheduling, and 24/7 emergency support. Let us light up your space safely!`,
    plumbers: `${name} is your trusted provider of professional plumbing solutions in the ${location} area. With years of experience, our licensed technicians handle pipe repairs, drain cleaning, water heater installations, leak detection, and bathroom remodel fittings. We pride ourselves on fast response times, neat workmanship, and cost-effective services. Contact ${name} today for hassle-free plumbing you can count on.`,
    clinics: `At ${name}, your health and well-being are in expert hands. Located in the heart of ${location}, our state-of-the-art clinic offers comprehensive medical checkups, diagnostic services, specialist consultations, and preventative healthcare plans. Our dedicated team of doctors and medical staff is committed to providing compassionate, patient-centered care for your entire family in a clean and safe environment.`,
    gyms: `Transform your fitness journey at ${name}, the premier gym and fitness center in ${location}. We offer a fully equipped, modern training facility featuring top-tier cardio machines, free weights, strength circuits, and group classes (Yoga, Zumba, HIIT). Our certified personal trainers are dedicated to helping you achieve your strength, fat loss, or lifestyle goals. Join ${name} today and unlock your true potential!`,
    salons: `Indulge in a premium pampering experience at ${name}, ${location}'s leading boutique unisex salon. We offer a full range of services including designer haircuts, hair color makeovers, keratin treatments, deep facials, manicure/pedicures, and bridal packages. Our creative stylists stay updated with the latest trends and use high-quality products to elevate your personal style. Book your retreat at ${name} today!`,
    'cctv-shops': `Protect what matters most with ${name}. We are ${location}'s leading security and surveillance specialist, offering high-definition CCTV camera systems, smart video doorbells, biometric door locks, burglar alarms, and remote monitoring setup. Our experienced installation team delivers custom security solutions tailored for homes, retail storefronts, and large offices. Get a free security assessment from ${name} today.`
  };

  const catLower = category.toLowerCase();
  let generated = textTemplates[catLower];

  if (!generated) {
    // Fallback template
    generated = `${name} is a premier ${category} provider serving the community of ${location}. We are committed to providing top-quality service, professional workmanship, and unmatched customer satisfaction. With a focus on reliability and excellence, ${name} has built a trusted reputation locally. Contact us today to learn more about how we can serve your needs!`;
  }

  return res.json({ description: generated });
});

// POST /api/businesses/generate-seo - Mock AI SEO Tags generator
router.post('/generate-seo', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  const { name, category, location } = req.body;
  if (!name || !category || !location) {
    return res.status(400).json({ error: 'Missing name, category, or location' });
  }

  const metaTitle = `Best ${category} in ${location} | ${name}`;
  const metaDescription = `Looking for top-rated ${category} services in ${location}? Visit ${name} for professional, affordable, and certified local solutions. Check reviews, gallery, working hours, and contact details!`;
  const keywords = `${name}, ${category} in ${location}, best ${category} ${location}, local ${category} services, ${location} listings, book ${category} online`;

  return res.json({
    metaTitle,
    metaDescription,
    keywords
  });
});

// GET /api/businesses/all/products - Get all products/offers in the marketplace
router.get('/all/products', async (req: Request, res: Response) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;
    const page = req.query.page ? parseInt(req.query.page as string) : 1;
    const skip = (page - 1) * limit;

    const { query, city, filterType } = req.query;

    const whereClause: any = {};
    if (filterType === 'offers') whereClause.isOffer = true;
    if (filterType === 'products') whereClause.isOffer = false;

    if (query) {
      whereClause.OR = [
        { name: { contains: query as string } },
        { description: { contains: query as string } }
      ];
    }
    
    if (city) {
      whereClause.business = { city: { contains: city as string } };
    }

    const products = await prisma.product.findMany({
      where: whereClause,
      include: {
        business: {
          select: {
            id: true,
            name: true,
            slug: true,
            city: true,
            hours: true,
            categoryId: true,
            category: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit
    });
    return res.json(products);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// GET /api/businesses/:businessId/products - Get all products for a specific business
router.get('/:businessId/products', async (req: Request, res: Response) => {
  try {
    const { businessId } = req.params;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;
    const page = req.query.page ? parseInt(req.query.page as string) : 1;
    const skip = (page - 1) * limit;

    const products = await prisma.product.findMany({
      where: { businessId },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit
    });
    return res.json(products);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// POST /api/businesses/products/manage - Create a new product/offer (OWNER/ADMIN only)
router.post('/products/manage', authenticateToken, requireRole(['OWNER', 'ADMIN']), validate(createProductSchema), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { businessId, name, description, price, image, isOffer, offerDiscount } = req.body;
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

    // Verify the business belongs to the owner
    const business = await prisma.business.findFirst({
      where: { id: businessId, userId: req.user.id }
    });

    if (!business && req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Forbidden: You do not own this business listing' });
    }

    const product = await prisma.product.create({
      data: {
        businessId,
        name,
        description,
        price: parseFloat(price),
        image: image || null,
        isOffer: !!isOffer,
        offerDiscount: offerDiscount || null
      }
    });

    return res.status(201).json(product);
  } catch (error: any) {
    return res.status(500).json({ error: 'Failed to create product: ' + error.message });
  }
});

// PUT /api/businesses/products/manage/:id - Edit an existing product/offer (OWNER/ADMIN only)
router.put('/products/manage/:id', authenticateToken, requireRole(['OWNER', 'ADMIN']), validate(updateProductSchema), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description, price, image, isOffer, offerDiscount } = req.body;
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

    const product = await prisma.product.findUnique({
      where: { id },
      include: { business: true }
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Check ownership of the business associated with this product
    if (product.business.userId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Forbidden: You do not own this business' });
    }

    const updated = await prisma.product.update({
      where: { id },
      data: {
        name: name !== undefined ? name : product.name,
        description: description !== undefined ? description : product.description,
        price: price !== undefined ? parseFloat(price) : product.price,
        image: image !== undefined ? image : product.image,
        isOffer: isOffer !== undefined ? !!isOffer : product.isOffer,
        offerDiscount: offerDiscount !== undefined ? offerDiscount : product.offerDiscount
      }
    });

    return res.json(updated);
  } catch (error: any) {
    return res.status(500).json({ error: 'Failed to update product: ' + error.message });
  }
});

// DELETE /api/businesses/products/manage/:id - Delete a product/offer (OWNER/ADMIN only)
router.delete('/products/manage/:id', authenticateToken, requireRole(['OWNER', 'ADMIN']), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

    const product = await prisma.product.findUnique({
      where: { id },
      include: { business: true }
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Check ownership
    if (product.business.userId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Forbidden: You do not own this business' });
    }

    await prisma.product.delete({ where: { id } });

    return res.json({ success: true, message: 'Product deleted successfully' });
  } catch (error: any) {
    return res.status(500).json({ error: 'Failed to delete product: ' + error.message });
  }
});

// DELETE /api/businesses/:id - Delete a business listing (OWNER or ADMIN only)
router.delete('/:id', authenticateToken, requireRole(['OWNER', 'ADMIN']), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

    const business = await prisma.business.findUnique({ where: { id } });
    if (!business) {
      return res.status(404).json({ error: 'Business not found' });
    }

    // Check ownership (unless admin)
    if (business.userId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Forbidden: You do not own this listing' });
    }

    await prisma.business.delete({ where: { id } });

    return res.json({ success: true, message: 'Business deleted successfully' });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to delete business: ' + error.message });
  }
});

// PUT /api/businesses/categories/:id - Edit a category (ADMIN only)
router.put('/categories/:id', authenticateToken, requireRole(['ADMIN']), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { name, icon } = req.body;

    const category = await prisma.category.findUnique({ where: { id } });
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    const updated = await prisma.category.update({
      where: { id },
      data: {
        ...(name !== undefined && { name, slug: slugify(name) }),
        ...(icon !== undefined && { icon })
      }
    });

    return res.json(updated);
  } catch (error: any) {
    return res.status(500).json({ error: 'Failed to update category: ' + error.message });
  }
});

// DELETE /api/businesses/categories/:id - Delete a category (ADMIN only)
router.delete('/categories/:id', authenticateToken, requireRole(['ADMIN']), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;

    const category = await prisma.category.findUnique({
      where: { id },
      include: { businesses: { select: { id: true } } }
    });

    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    if (category.businesses.length > 0) {
      return res.status(400).json({ error: `Cannot delete: ${category.businesses.length} businesses use this category. Reassign them first.` });
    }

    await prisma.category.delete({ where: { id } });

    return res.json({ success: true, message: 'Category deleted successfully' });
  } catch (error: any) {
    return res.status(500).json({ error: 'Failed to delete category: ' + error.message });
  }
});

// GET /api/businesses/sliders/all - Get all home hero sliders
router.get('/sliders/all', async (req: Request, res: Response) => {
  try {
    const filePath = path.join(__dirname, '..', 'data', 'sliders.json');
    if (!fs.existsSync(filePath)) {
      return res.json([]);
    }
    const data = await fsPromises.readFile(filePath, 'utf-8');
    return res.json(JSON.parse(data));
  } catch (error: any) {
    return res.status(500).json({ error: 'Failed to read sliders: ' + error.message });
  }
});

// POST /api/businesses/sliders/manage - Save updated list of sliders (ADMIN only)
router.post('/sliders/manage', authenticateToken, requireRole(['ADMIN']), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { sliders } = req.body;
    if (!sliders || !Array.isArray(sliders)) {
      return res.status(400).json({ error: 'Sliders array is required' });
    }

    // Basic validation of fields
    for (const slide of sliders) {
      if (!slide.badge || !slide.title || !slide.desc || !slide.image) {
        return res.status(400).json({ error: 'Each slide must have a badge, title, desc, and image.' });
      }
    }

    const filePath = path.join(__dirname, '..', 'data', 'sliders.json');
    
    // Ensure the data directory exists
    const dirPath = path.dirname(filePath);
    if (!fs.existsSync(dirPath)) {
      await fsPromises.mkdir(dirPath, { recursive: true });
    }

    await fsPromises.writeFile(filePath, JSON.stringify(sliders, null, 2), 'utf-8');
    return res.json({ success: true, message: 'Sliders updated successfully', sliders });
  } catch (error: any) {
    return res.status(500).json({ error: 'Failed to save sliders: ' + error.message });
  }
});

// POST /api/businesses/:id/follow - Persistent unique follower toggling (with duplicate checks)
router.post('/:id/follow', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

    const business = await prisma.business.findUnique({ where: { id } });
    if (!business) return res.status(404).json({ error: 'Business not found' });

    let hoursMap: any = {};
    try {
      hoursMap = typeof business.hours === 'string' ? JSON.parse(business.hours) : (business.hours || {});
    } catch (e) {
      hoursMap = {};
    }

    if (!hoursMap.followersList || !Array.isArray(hoursMap.followersList)) {
      hoursMap.followersList = [];
    }

    const userId = req.user.id;
    const isFollowing = hoursMap.followersList.includes(userId);

    if (isFollowing) {
      // Unfollow: remove user from unique list
      hoursMap.followersList = hoursMap.followersList.filter((uid: string) => uid !== userId);
    } else {
      // Follow: add user to unique list (no duplicates)
      hoursMap.followersList.push(userId);
    }

    const updated = await prisma.business.update({
      where: { id },
      data: {
        hours: JSON.stringify(hoursMap)
      }
    });

    return res.json({
      success: true,
      isFollowing: !isFollowing,
      followerCount: hoursMap.followersList.length
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

export default router;

