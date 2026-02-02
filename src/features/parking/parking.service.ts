import {
  PaginationResult,
  createPaginatedResult,
} from "../../utils/pagination.js";
import { NotFoundError, ForbiddenError } from "../../errors/index.js";
import * as parkingRepository from "./parking.repository.js";
import { Parking, Prisma } from "../../../prisma/generated/client.js";
import {
  CreateParkingDto,
  UpdateParkingDto,
  ParkingQuery,
} from "./parking.schema.js";

export const create = async (
  ownerId: string,
  dto: CreateParkingDto,
): Promise<Parking> => {
  const data: Prisma.ParkingCreateInput = {
    ...dto,
    owner: { connect: { id: ownerId } },
  };
  return parkingRepository.create(data);
};

export const findById = async (id: string): Promise<Parking> => {
  const parking = await parkingRepository.findById(id);
  if (!parking) throw new NotFoundError("Parking not found");
  return parking;
};

export const findOwned = async (ownerId: string): Promise<Parking[]> => {
  return parkingRepository.findByOwner(ownerId);
};

export const update = async (
  ownerId: string,
  parkingId: string,
  dto: UpdateParkingDto,
): Promise<Parking> => {
  const parking = await parkingRepository.findById(parkingId);
  if (!parking) throw new NotFoundError("Parking not found");

  if (parking.ownerId !== ownerId) throw new ForbiddenError("Access denied");

  return parkingRepository.update(parkingId, dto);
};

export const findAll = async (
  query: ParkingQuery,
): Promise<PaginationResult<Parking>> => {
  const { page, limit } = query;
  const skip = (page - 1) * limit;
  const { data, total } = await parkingRepository.findAll(skip, limit);

  return createPaginatedResult(data, total, page, limit);
};
