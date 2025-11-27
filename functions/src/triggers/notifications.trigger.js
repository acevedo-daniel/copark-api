import { onValueCreated } from "firebase-functions/v2/database";
import { logger } from "firebase-functions";
import { db } from "../config/firebase.js";

export const onBookingCreate = onValueCreated(
    "/bookings/{bookingId}",
    async (event) => {
      const snapshot = event.data;
      const booking = snapshot.val();
      const bookingId = event.params.bookingId;

      logger.info(`New booking detected: ${bookingId}`, {
        structuredData: true,
        bookingId,
      });

      try {
        const parkingSnapshot = await db
            .ref(`parkings/${booking.parkingId}`)
            .once("value");
        const parking = parkingSnapshot.val();

        if (!parking) {
          logger.warn(`Parking not found for booking ${bookingId}`, {
            bookingId,
            parkingId: booking.parkingId,
          });
          return null;
        }

        const ownerSnapshot = await db
            .ref(`users/${parking.ownerId}`)
            .once("value");
        const owner = ownerSnapshot.val();

        if (!owner) {
          logger.warn(`Owner not found: ${parking.ownerId}`, {
            bookingId,
            ownerId: parking.ownerId,
          });
          return null;
        }

        logger.info(`Sending email notification`, {
          to: owner.email,
          ownerName: owner.fullName,
          subject: `New booking at ${parking.title}`,
          body: `User ${booking.driverId} has reserved your parking spot.`,
          vehicle: `${booking.vehicleSnapshot.brand} ${booking.vehicleSnapshot.model} (${booking.vehicleSnapshot.plate})`,
          total: booking.totalPrice,
        });

        return null;
      } catch (error) {
        logger.error("Error processing booking notification", {
          error: error.message,
          stack: error.stack,
        });
        return null;
      }
    },
);
