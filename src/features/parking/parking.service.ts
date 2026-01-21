import {
  parsePaginationParams,
  PaginationResult,
  createPaginatedResult,
} from "../../utils/pagination.js";
import { NotFoundError, UnauthorizedError } from "../../errors/index.js";
import * as parkingRepository from "./parking.repository.js";
import { Parking, Prisma } from "../../../prisma/generated/client.js";
import { CreateParkingDto, UpdateParkingDto } from "./parking.schema.js";

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

export const findByOwnerId = async (ownerId: string): Promise<Parking[]> => {
  return parkingRepository.findByOwnerId(ownerId);
};

export const update = async (
  ownerId: string,
  parkingId: string,
  dto: UpdateParkingDto,
): Promise<Parking> => {
  const parking = await parkingRepository.findById(parkingId);
  if (!parking) throw new NotFoundError("Parking not found");

  if (parking.ownerId !== ownerId)
    throw new UnauthorizedError("Unauthorized access");

  return parkingRepository.update(parkingId, dto);
};

export const findAllPaginated = async (query: {
  page?: string;
  limit?: string;
}): Promise<PaginationResult<Parking>> => {
  const { skip, take, page, limit } = parsePaginationParams(query);
  const { data, total } = await parkingRepository.findManyPaginated(skip, take);

  return createPaginatedResult(data, total, page, limit);
};
