import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  try {
    const totalReviews = await prisma.review.count();
    console.log("TOTAL_REVIEWS_COUNT:" + totalReviews);
    
    // Also let's print overall reviews rating average
    const reviews = await prisma.review.findMany();
    if (reviews.length > 0) {
      const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
      console.log("AVG_RATING:" + avg.toFixed(2));
    } else {
      console.log("AVG_RATING:0");
    }
  } catch (error) {
    console.error("Error connecting to DB:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
