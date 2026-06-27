const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const totalReviews = await prisma.review.count();
    console.log("RESULT:TOTAL_REVIEWS:" + totalReviews);
    
    const reviews = await prisma.review.findMany({
      include: {
        business: { select: { name: true } },
        user: { select: { name: true } }
      }
    });
    console.log("RESULT:REVIEWS_LIST:");
    reviews.forEach(r => {
      console.log(`- ${r.user?.name || 'Unknown User'} gave ${r.rating} stars to "${r.business?.name || 'Unknown Business'}": "${r.comment}"`);
    });

    const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / (reviews.length || 1);
    console.log("RESULT:AVG_RATING:" + avg.toFixed(2));
  } catch (error) {
    console.error("DB_ERROR:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
