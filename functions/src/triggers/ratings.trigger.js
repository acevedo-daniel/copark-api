import { onValueCreated } from "firebase-functions/v2/database";
import { logger } from "firebase-functions";
import { db } from "../config/firebase.js";

export const onReviewCreate = onValueCreated(
    "/reviews/{reviewId}",
    async (event) => {
      const snapshot = event.data;
      const review = snapshot.val();
      const parkingId = review.parkingId;

      logger.info(`Recalculating stars for parking: ${parkingId}`, {
        structuredData: true,
        parkingId,
      });

      try {
        const reviewsSnapshot = await db
            .ref("reviews")
            .orderByChild("parkingId")
            .equalTo(parkingId)
            .once("value");

        const reviewsMap = reviewsSnapshot.val();

        if (!reviewsMap) return null;

        const reviewsArray = Object.values(reviewsMap);

        const sum = reviewsArray.reduce((acc, curr) => acc + curr.rating, 0);
        const average = sum / reviewsArray.length;

        const finalRating = Math.round(average * 10) / 10;

        logger.info(
            `New average: ${finalRating} (${reviewsArray.length} reviews)`,
            {
              structuredData: true,
              parkingId,
              finalRating,
              reviewCount: reviewsArray.length,
            },
        );

        await db.ref(`parkings/${parkingId}`).update({
          rating: finalRating,
        });

        return null;
      } catch (error) {
        logger.error("Error recalculating ratings", {
          error: error.message,
          stack: error.stack,
        });
        return null;
      }
    },
);
