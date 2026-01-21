import { prisma } from "../../config/prisma.js";
import { Review } from "../../../prisma/generated/client.js";
export const create = async (data: Review): Promise<Review> => {
  return await prisma.review.create({
    data: data,
  });
};

export const findByParkingId = async (parkingId: string): Promise<Review[]> => {
  return await prisma.review.findMany({
    where: { parkingId: parkingId },
  });
};
