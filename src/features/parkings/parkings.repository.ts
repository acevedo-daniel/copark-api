import { prisma } from "../../config/prisma.js";
import { Parking } from "@prisma/client";

export const create = async (data: Parking): Promise<Parking> => {
  return await prisma.parking.create({
    data: data,
  });
};

export const findAll = async (): Promise<Parking[]> => {
  return await prisma.parking.findMany();
};

export const findById = async (parkingId: string): Promise<Parking | null> => {
  return await prisma.parking.findUnique({
    where: { id: parkingId },
  });
};

export const findByOwnerId = async (ownerId: string): Promise<Parking[]> => {
  return await prisma.parking.findMany({
    where: { ownerId: ownerId },
  });
};

export const update = async (
  parkingId: string,
  data: Parking,
): Promise<Parking> => {
  return await prisma.parking.update({
    where: { id: parkingId },
    data: data,
  });
};
