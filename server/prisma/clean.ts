import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Cleaning database...');

  // Delete dependent tables first
  const proposalDel = await prisma.proposal.deleteMany({});
  console.log(`Deleted ${proposalDel.count} proposals.`);

  const productDel = await prisma.product.deleteMany({});
  console.log(`Deleted ${productDel.count} products.`);

  const leadDel = await prisma.lead.deleteMany({});
  console.log(`Deleted ${leadDel.count} leads.`);

  const reviewDel = await prisma.review.deleteMany({});
  console.log(`Deleted ${reviewDel.count} reviews.`);

  const rfqDel = await prisma.rfq.deleteMany({});
  console.log(`Deleted ${rfqDel.count} RFQs.`);

  const dealerRequestDel = await prisma.dealerRequest.deleteMany({});
  console.log(`Deleted ${dealerRequestDel.count} dealer requests.`);

  // Find admin user(s) to keep
  const adminUsers = await prisma.user.findMany({
    where: { role: 'ADMIN' }
  });
  const adminIds = adminUsers.map(u => u.id);
  console.log(`Found ${adminIds.length} admin user(s).`);

  // Delete subscriptions for non-admin users
  const subDel = await prisma.subscription.deleteMany({
    where: {
      userId: { notIn: adminIds }
    }
  });
  console.log(`Deleted ${subDel.count} subscriptions.`);

  // Delete businesses
  const bizDel = await prisma.business.deleteMany({});
  console.log(`Deleted ${bizDel.count} businesses.`);

  // Delete users except admins
  const userDel = await prisma.user.deleteMany({
    where: {
      role: { not: 'ADMIN' }
    }
  });
  console.log(`Deleted ${userDel.count} non-admin users.`);

  console.log('Database cleaned successfully!');
}

main()
  .catch((e) => {
    console.error('Error cleaning database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
