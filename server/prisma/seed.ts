import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding started...');

  // 1. Clean database
  await prisma.product.deleteMany({});
  await prisma.review.deleteMany({});
  await prisma.lead.deleteMany({});
  await prisma.subscription.deleteMany({});
  await prisma.business.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.user.deleteMany({});

  // 2. Create categories
  const categoriesData = [
    { name: 'Restaurants', slug: 'restaurants', icon: 'Utensils' },
    { name: 'Electricians', slug: 'electricians', icon: 'Zap' },
    { name: 'Plumbers', slug: 'plumbers', icon: 'Droplet' },
    { name: 'Clinics', slug: 'clinics', icon: 'Activity' },
    { name: 'Gyms', slug: 'gyms', icon: 'Dumbbell' },
    { name: 'Salons', slug: 'salons', icon: 'Scissors' },
    { name: 'CCTV Shops', slug: 'cctv-shops', icon: 'Camera' },
    { name: 'Real Estate Agents', slug: 'real-estate', icon: 'Home' },
    { name: 'Local Retail Stores', slug: 'retail-stores', icon: 'ShoppingBag' }
  ];

  const categories: Record<string, any> = {};
  for (const cat of categoriesData) {
    categories[cat.slug] = await prisma.category.create({
      data: cat
    });
  }
  console.log('Categories seeded.');

  // 3. Create Users
  // Business Owners
  const owner1 = await prisma.user.create({
    data: {
      name: 'Rajesh Kumar',
      email: 'rajesh@compaanynamedelaerss.com',
      phone: '9876543210',
      password: 'password123',
      role: 'OWNER'
    }
  });

  const owner2 = await prisma.user.create({
    data: {
      name: 'Anjali Sharma',
      email: 'anjali@compaanynamedelaerss.com',
      phone: '9876543211',
      password: 'password123',
      role: 'OWNER'
    }
  });

  // Regular Customers
  const customer1 = await prisma.user.create({
    data: {
      name: 'Vikram Singh',
      email: 'vikram@example.com',
      phone: '9876543212',
      password: 'password123',
      role: 'CUSTOMER'
    }
  });

  const customer2 = await prisma.user.create({
    data: {
      name: 'Priya Patel',
      email: 'priya@example.com',
      phone: '9876543213',
      password: 'password123',
      role: 'CUSTOMER'
    }
  });

  const adminUser = await prisma.user.create({
    data: {
      name: 'System Admin',
      email: 'admin@compaanynamedelaerss.com',
      phone: '9999999999',
      password: 'adminpassword',
      role: 'ADMIN'
    }
  });
  console.log('Users seeded.');

  // 4. Create Subscriptions
  await prisma.subscription.create({
    data: {
      userId: owner1.id,
      plan: 'PRO',
      startDate: new Date(),
      expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
    }
  });

  await prisma.subscription.create({
    data: {
      userId: owner2.id,
      plan: 'FREE',
      startDate: new Date(),
      expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // 1 year
    }
  });
  console.log('Subscriptions seeded.');

  // 5. Create Businesses
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
      categoryId: categories['restaurants'].id,
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
      categoryId: categories['cctv-shops'].id,
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
      categoryId: categories['electricians'].id,
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
      categoryId: categories['salons'].id,
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

  console.log('Businesses seeded.');

  // 6. Seed reviews
  await prisma.review.create({
    data: {
      businessId: b1.id,
      userId: customer1.id,
      rating: 5,
      comment: 'Absolutely loved the food! The chicken biryani is the best I have ever had. Excellent ambience and friendly staff.'
    }
  });

  await prisma.review.create({
    data: {
      businessId: b1.id,
      userId: customer2.id,
      rating: 4,
      comment: 'Very tasty butter chicken. Service was a bit slow on Sunday night but the taste compensated for it. Recommended!'
    }
  });

  await prisma.review.create({
    data: {
      businessId: b2.id,
      userId: customer1.id,
      rating: 5,
      comment: 'Excellent installation. Rajesh and his team were highly professional. They finished 8 cameras setup in 4 hours and configured the mobile app view. Very clean job!'
    }
  });

  await prisma.review.create({
    data: {
      businessId: b4.id,
      userId: customer2.id,
      rating: 4,
      comment: 'Got a haircut and spa service here. Stylists are experienced. Slightly expensive but quality is premium.'
    }
  });

  console.log('Reviews seeded.');

  // 7. Seed Leads
  await prisma.lead.create({
    data: {
      businessId: b2.id,
      customerName: 'Sanjay Dutt',
      phone: '9988776655',
      message: 'Need 4 outdoor cameras installed at my retail shop in Madhapur next weekend.',
      status: 'NEW',
      score: 'HOT',
      scoreReason: 'Highly specific requirement, clear location, and urgent timeline (next weekend).'
    }
  });

  await prisma.lead.create({
    data: {
      businessId: b2.id,
      customerName: 'Amit Verma',
      phone: '9898989898',
      message: 'Just exploring pricing options for home CCTV. Not sure how many cameras are needed.',
      status: 'CONTACTED',
      score: 'COLD',
      scoreReason: 'Exploratory message with no timeline, budget, or configuration details.'
    }
  });

  await prisma.lead.create({
    data: {
      businessId: b3.id,
      customerName: 'Rohan Joshi',
      phone: '9123456789',
      message: 'Inquiry for full apartment rewiring. Need quotation.',
      status: 'NEW',
      score: 'WARM',
      scoreReason: 'Medium urgency. Clear requirement for rewiring, needs pricing details before commitment.'
    }
  });
  // 8. Seed Products & Offers
  await prisma.product.create({
    data: {
      businessId: b1.id,
      name: 'Royal Veg Biryani',
      description: 'Basmati rice cooked with fresh seasonal vegetables and aromatic spices. Serves 2.',
      price: 320,
      image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500',
      isOffer: false
    }
  });

  await prisma.product.create({
    data: {
      businessId: b1.id,
      name: 'Catering Service Package (50 Pax)',
      description: 'Full catering menu including starters, main course, and desserts for up to 50 guests. Perfect for corporate events or private parties.',
      price: 15000,
      image: 'https://images.unsplash.com/photo-1555244162-803834f70033?w=500',
      isOffer: true,
      offerDiscount: '10% OFF'
    }
  });

  await prisma.product.create({
    data: {
      businessId: b2.id,
      name: '4MP Outdoor Bullet Camera',
      description: 'Weatherproof bullet security camera with smart infrared night vision, human motion detection, and mobile alerts.',
      price: 2800,
      image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=500',
      isOffer: false
    }
  });

  await prisma.product.create({
    data: {
      businessId: b2.id,
      name: 'Complete 4-Camera CCTV Setup',
      description: 'Includes 4 HD dome cameras, 4-channel DVR, 1TB surveillance hard drive, power supply, cabling, and free installation.',
      price: 14500,
      image: 'https://images.unsplash.com/photo-1528319725582-ddc096101511?w=500',
      isOffer: true,
      offerDiscount: 'Flat ₹2,000 Off'
    }
  });

  await prisma.product.create({
    data: {
      businessId: b4.id,
      name: 'Premium Hair Spa & Styling',
      description: 'Deep conditioning hair spa treatment followed by professional blow dry and customizable hair styling.',
      price: 1200,
      image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=500',
      isOffer: false
    }
  });

  await prisma.product.create({
    data: {
      businessId: b4.id,
      name: 'Bridal Makeover Package',
      description: 'Premium HD bridal makeup, hairstyling, saree/lehenga draping, facial treatment, and nail art.',
      price: 8500,
      image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=500',
      isOffer: true,
      offerDiscount: '20% OFF'
    }
  });

  console.log('Products & Offers seeded.');
  console.log('Leads seeded.');
  console.log('Database seeding complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
