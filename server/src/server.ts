import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Import routes
import authRoutes from './routes/auth';
import businessRoutes from './routes/businesses';
import leadRoutes from './routes/leads';
import reviewRoutes from './routes/reviews';
import subscriptionRoutes from './routes/subscriptions';
import rfqRoutes from './routes/rfqs';
import adminRoutes from './routes/admin';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: '*', // Allow all origins for local testing convenience
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/businesses', businessRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/rfqs', rfqRoutes);
app.use('/api/admin', adminRoutes);

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// Health Check
app.get('/api/clean-db-secret', async (req: Request, res: Response) => {
  try {
    const proposalDel = await prisma.proposal.deleteMany({});
    const productDel = await prisma.product.deleteMany({});
    const leadDel = await prisma.lead.deleteMany({});
    const reviewDel = await prisma.review.deleteMany({});
    const rfqDel = await prisma.rfq.deleteMany({});
    const dealerRequestDel = await prisma.dealerRequest.deleteMany({});

    const adminUsers = await prisma.user.findMany({
      where: { role: 'ADMIN' }
    });
    const adminIds = adminUsers.map(u => u.id);

    const subDel = await prisma.subscription.deleteMany({
      where: { userId: { notIn: adminIds } }
    });

    const bizDel = await prisma.business.deleteMany({});

    const userDel = await prisma.user.deleteMany({
      where: { role: { not: 'ADMIN' } }
    });

    res.json({
      success: true,
      message: 'Database cleaned successfully',
      deleted: {
        proposals: proposalDel.count,
        products: productDel.count,
        leads: leadDel.count,
        reviews: reviewDel.count,
        rfqs: rfqDel.count,
        dealerRequests: dealerRequestDel.count,
        subscriptions: subDel.count,
        businesses: bizDel.count,
        users: userDel.count
      }
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

// Global Error Handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error: ' + err.message });
});

// Self-healing startup seeding function
async function seedDefaultDataIfEmpty() {
  try {
    const businessCount = await prisma.business.count();
    if (businessCount === 0) {
      console.log('No businesses found in the database. Auto-seeding dynamic demo data...');
      
      // 1. Create categories (ensure they exist)
      let categories = await prisma.category.findMany();
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
      
      const categoriesMap: Record<string, any> = {};
      categories.forEach(c => {
        categoriesMap[c.slug] = c;
      });

      // 2. Create Users safely
      let owner1 = await prisma.user.findUnique({ where: { email: 'rajesh@compaanynamedelaerss.com' } });
      if (!owner1) {
        owner1 = await prisma.user.create({
          data: { name: 'Rajesh Kumar', email: 'rajesh@compaanynamedelaerss.com', phone: '9876543210', password: 'password123', role: 'OWNER' }
        });
      }

      let owner2 = await prisma.user.findUnique({ where: { email: 'anjali@compaanynamedelaerss.com' } });
      if (!owner2) {
        owner2 = await prisma.user.create({
          data: { name: 'Anjali Sharma', email: 'anjali@compaanynamedelaerss.com', phone: '9876543211', password: 'password123', role: 'OWNER' }
        });
      }

      let customer1 = await prisma.user.findUnique({ where: { email: 'vikram@example.com' } });
      if (!customer1) {
        customer1 = await prisma.user.create({
          data: { name: 'Vikram Singh', email: 'vikram@example.com', phone: '9876543212', password: 'password123', role: 'CUSTOMER' }
        });
      }

      let customer2 = await prisma.user.findUnique({ where: { email: 'priya@example.com' } });
      if (!customer2) {
        customer2 = await prisma.user.create({
          data: { name: 'Priya Patel', email: 'priya@example.com', phone: '9876543213', password: 'password123', role: 'CUSTOMER' }
        });
      }

      let adminUser = await prisma.user.findUnique({ where: { email: 'admin@compaanynamedelaerss.com' } });
      if (!adminUser) {
        adminUser = await prisma.user.create({
          data: { name: 'System Admin', email: 'admin@compaanynamedelaerss.com', phone: '9999999999', password: 'adminpassword', role: 'ADMIN' }
        });
      }

      // 3. Create Subscriptions safely
      const sub1 = await prisma.subscription.findUnique({ where: { userId: owner1.id } });
      if (!sub1) {
        await prisma.subscription.create({
          data: { userId: owner1.id, plan: 'PRO', startDate: new Date(), expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) }
        });
      }

      const sub2 = await prisma.subscription.findUnique({ where: { userId: owner2.id } });
      if (!sub2) {
        await prisma.subscription.create({
          data: { userId: owner2.id, plan: 'FREE', startDate: new Date(), expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) }
        });
      }

      // 4. Create Businesses
      const workingHours = JSON.stringify({
        monday: '09:00 - 21:00',
        tuesday: '09:00 - 21:00',
        wednesday: '09:00 - 21:00',
        thursday: '09:00 - 21:00',
        friday: '09:00 - 21:00',
        saturday: '10:00 - 22:00',
        sunday: 'Closed'
      });

      const b1 = await prisma.business.create({
        data: {
          userId: owner1.id,
          name: 'Spice Garden Restaurant',
          slug: 'spice-garden-restaurant',
          categoryId: categoriesMap['restaurants'].id,
          description: 'Authentic Indian restaurant serving delicious North and South Indian delicacies. Known for our signature Biryani, butter chicken, and cozy, family-friendly ambience. We cater for parties, marriages, and corporate events with high-quality ingredients and prompt service.',
          address: 'Road No. 12, Banjara Hills',
          city: 'Hyderabad',
          state: 'Telangana',
          latitude: 17.4156,
          longitude: 78.4346,
          status: 'VERIFIED',
          phone: '040-12345678',
          email: 'spicegarden@example.com',
          whatsapp: '9876543210',
          website: 'https://spicegarden-hyderabad.com',
          hours: workingHours,
          gallery: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500,https://images.unsplash.com/photo-1552566626-52f8b828add9?w=500'
        }
      });

      const b2 = await prisma.business.create({
        data: {
          userId: owner1.id,
          name: 'SafeHome CCTV Solutions',
          slug: 'safehome-cctv-solutions',
          categoryId: categoriesMap['cctv-shops'].id,
          description: 'Leading provider of security and surveillance systems. We specialize in high-definition CCTV installations, biometric access controls, smart locks, home automation, and 24/7 technical support. Safeguard your family and business with our premium-grade equipment.',
          address: 'Madhapur Main Road, Near Metro Pillar 1400',
          city: 'Hyderabad',
          state: 'Telangana',
          latitude: 17.4483,
          longitude: 78.3741,
          status: 'VERIFIED',
          phone: '9876543210',
          email: 'info@safehomecctv.com',
          whatsapp: '9876543210',
          website: 'https://safehomecctv.com',
          hours: workingHours,
          gallery: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=500,https://images.unsplash.com/photo-1528319725582-ddc096101511?w=500'
        }
      });

      const b3 = await prisma.business.create({
        data: {
          userId: owner2.id,
          name: 'Sparky Electricians & Services',
          slug: 'sparky-electricians-services',
          categoryId: categoriesMap['electricians'].id,
          description: 'Professional electrical repairs, wiring, and installations. Serving domestic and commercial premises. Safe, certified, and fully background-checked electricians available on-demand. Emergency breakdown services are available 24/7.',
          address: 'Link Road, Andheri West',
          city: 'Mumbai',
          state: 'Maharashtra',
          latitude: 19.1363,
          longitude: 72.8276,
          status: 'VERIFIED',
          phone: '022-87654321',
          email: 'sparkyelectricals@example.com',
          whatsapp: '9876543211',
          website: '',
          hours: workingHours,
          gallery: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=500'
        }
      });

      const b4 = await prisma.business.create({
        data: {
          userId: owner2.id,
          name: 'Glow Up Unisex Salon',
          slug: 'glow-up-unisex-salon',
          categoryId: categoriesMap['salons'].id,
          description: 'Step in for a luxurious styling experience. We offer advanced haircuts, hair coloring, professional makeup, facials, bridal packages, and skin treatments. Our certified stylists use top-tier organic products to give you the glow you deserve.',
          address: '100 Feet Road, Indiranagar',
          city: 'Bangalore',
          state: 'Karnataka',
          latitude: 12.9719,
          longitude: 77.6412,
          status: 'VERIFIED',
          phone: '080-99998888',
          email: 'glowupsalon@example.com',
          whatsapp: '9876543211',
          website: 'https://glowupsalon.in',
          hours: workingHours,
          gallery: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=500,https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=500'
        }
      });

      // 5. Seed Reviews
      await prisma.review.create({
        data: { businessId: b1.id, userId: customer1.id, rating: 5, comment: 'Absolutely loved the food! The chicken biryani is the best I have ever had. Excellent ambience and friendly staff.' }
      });
      await prisma.review.create({
        data: { businessId: b1.id, userId: customer2.id, rating: 4, comment: 'Very tasty butter chicken. Service was a bit slow on Sunday night but the taste compensated for it. Recommended!' }
      });
      await prisma.review.create({
        data: { businessId: b2.id, userId: customer1.id, rating: 5, comment: 'Excellent installation. Rajesh and his team were highly professional. They finished 8 cameras setup in 4 hours and configured the mobile app view. Very clean job!' }
      });
      await prisma.review.create({
        data: { businessId: b4.id, userId: customer2.id, rating: 4, comment: 'Got a haircut and spa service here. Stylists are experienced. Slightly expensive but quality is premium.' }
      });

      // 6. Seed Leads
      await prisma.lead.create({
        data: { businessId: b2.id, customerName: 'Sanjay Dutt', phone: '9988776655', message: 'Need 4 outdoor cameras installed at my retail shop in Madhapur next weekend.', status: 'NEW', score: 'HOT', scoreReason: 'Highly specific requirement, clear location, and urgent timeline (next weekend).' }
      });
      await prisma.lead.create({
        data: { businessId: b2.id, customerName: 'Amit Verma', phone: '9898989898', message: 'Just exploring pricing options for home CCTV. Not sure how many cameras are needed.', status: 'CONTACTED', score: 'COLD', scoreReason: 'Exploratory message with no timeline, budget, or configuration details.' }
      });
      await prisma.lead.create({
        data: { businessId: b3.id, customerName: 'Rohan Joshi', phone: '9123456789', message: 'Inquiry for full apartment rewiring. Need quotation.', status: 'NEW', score: 'WARM', scoreReason: 'Medium urgency. Clear requirement for rewiring, needs pricing details before commitment.' }
      });

      // 7. Seed Products
      await prisma.product.create({
        data: { businessId: b1.id, name: 'Royal Veg Biryani', description: 'Basmati rice cooked with fresh seasonal vegetables and aromatic spices. Serves 2.', price: 320, image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500', isOffer: false }
      });
      await prisma.product.create({
        data: { businessId: b1.id, name: 'Catering Service Package (50 Pax)', description: 'Full catering menu including starters, main course, and desserts for up to 50 guests. Perfect for corporate events or private parties.', price: 15000, image: 'https://images.unsplash.com/photo-1555244162-803834f70033?w=500', isOffer: true, offerDiscount: '10% OFF' }
      });
      await prisma.product.create({
        data: { businessId: b2.id, name: '4MP Outdoor Bullet Camera', description: 'Weatherproof bullet security camera with smart infrared night vision, human motion detection, and mobile alerts.', price: 2800, image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=500', isOffer: false }
      });
      await prisma.product.create({
        data: { businessId: b2.id, name: 'Complete 4-Camera CCTV Setup', description: 'Includes 4 HD dome cameras, 4-channel DVR, 1TB surveillance hard drive, power supply, cabling, and free installation.', price: 14500, image: 'https://images.unsplash.com/photo-1528319725582-ddc096101511?w=500', isOffer: true, offerDiscount: 'Flat ₹2,000 Off' }
      });
      await prisma.product.create({
        data: { businessId: b4.id, name: 'Premium Hair Spa & Styling', description: 'Deep conditioning hair spa treatment followed by professional blow dry and customizable hair styling.', price: 1200, image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=500', isOffer: false }
      });
      await prisma.product.create({
        data: { businessId: b4.id, name: 'Bridal Makeover Package', description: 'Premium HD bridal makeup, hairstyling, saree/lehenge draping, facial treatment, and nail art.', price: 8500, image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=500', isOffer: true, offerDiscount: '20% OFF' }
      });

      console.log('Database auto-seeded successfully with genuine initial data!');
    }
  } catch (error) {
    console.error('Error during startup database auto-seeding:', error);
  }
}

app.listen(PORT, () => {
  console.log(`LocalConnect Server running on port ${PORT}`);
  seedDefaultDataIfEmpty();
});
