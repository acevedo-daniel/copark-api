import { Booking, Vehicle, Parking } from "../../../prisma/generated/client.js";

export type BookingWithRelations = Booking & {
  vehicle: Vehicle;
  parking: Pick<Parking, "id" | "title" | "pricePerHour" | "ownerId">;
};
