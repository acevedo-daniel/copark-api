import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('../parking/parking.repository.js', () => ({
  findById: vi.fn(),
}));

vi.mock('./vehicle.repository.js', () => ({
  create: vi.fn(),
  findByPlate: vi.fn(),
}));

import { Prisma, type Parking, type Vehicle } from '../../../prisma/generated/client.js';
import { ConflictError, ForbiddenError, NotFoundError } from '../../errors/index.js';
import type { CreateVehicle } from './vehicle.schema.js';
import * as parkingRepository from '../parking/parking.repository.js';
import * as vehicleRepository from './vehicle.repository.js';
import { create, findByPlate } from './vehicle.service.js';

const buildParking = (overrides?: Partial<Parking>): Parking => {
  const now = new Date('2026-02-21T12:00:00.000Z');

  return {
    id: 'parking-1',
    title: 'Main Parking',
    description: null,
    image: null,
    address: '123 Test St',
    pricePerHour: 2000,
    totalSpaces: 20,
    lat: 10,
    lng: 10,
    isActive: true,
    ownerId: 'owner-1',
    createdAt: now,
    updatedAt: now,
    ...(overrides ?? {}),
  };
};

const buildVehicle = (overrides?: Partial<Vehicle>): Vehicle => {
  const now = new Date('2026-02-21T12:00:00.000Z');

  return {
    id: 'vehicle-1',
    plate: 'ABC123',
    brand: null,
    model: null,
    type: 'CAR',
    customerName: null,
    customerPhone: null,
    notes: null,
    createdAt: now,
    updatedAt: now,
    parkingId: 'parking-1',
    ...(overrides ?? {}),
  };
};

const createDto: CreateVehicle = {
  plate: 'ABC123',
  type: 'CAR',
};

describe('vehicle.service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('create', () => {
    it('creates vehicle when owner has access to parking', async () => {
      const vehicle = buildVehicle();
      vi.mocked(parkingRepository.findById).mockResolvedValue(buildParking());
      vi.mocked(vehicleRepository.create).mockResolvedValue(vehicle);

      const result = await create('owner-1', 'parking-1', createDto);

      expect(vehicleRepository.create).toHaveBeenCalledWith({
        ...createDto,
        parking: { connect: { id: 'parking-1' } },
      });
      expect(result).toEqual(vehicle);
    });

    it('throws NotFoundError when parking does not exist', async () => {
      vi.mocked(parkingRepository.findById).mockResolvedValue(null);

      await expect(create('owner-1', 'parking-1', createDto)).rejects.toBeInstanceOf(NotFoundError);
      expect(vehicleRepository.create).not.toHaveBeenCalled();
    });

    it('throws ForbiddenError when owner is not parking owner', async () => {
      vi.mocked(parkingRepository.findById).mockResolvedValue(buildParking({ ownerId: 'owner-2' }));

      await expect(create('owner-1', 'parking-1', createDto)).rejects.toBeInstanceOf(ForbiddenError);
      expect(vehicleRepository.create).not.toHaveBeenCalled();
    });

    it('throws ConflictError when plate already exists in parking', async () => {
      const uniquePlateError = Object.assign(
        Object.create(Prisma.PrismaClientKnownRequestError.prototype),
        { code: 'P2002', meta: { target: ['plate', 'parkingId'] } },
      ) as Prisma.PrismaClientKnownRequestError;

      vi.mocked(parkingRepository.findById).mockResolvedValue(buildParking());
      vi.mocked(vehicleRepository.create).mockRejectedValue(uniquePlateError);

      const promise = create('owner-1', 'parking-1', createDto);

      await expect(promise).rejects.toBeInstanceOf(ConflictError);
      await expect(promise).rejects.toThrow(
        'Vehicle plate already exists in this parking',
      );
    });

    it('rethrows unknown repository error', async () => {
      const unknownError = new Error('db failed');
      vi.mocked(parkingRepository.findById).mockResolvedValue(buildParking());
      vi.mocked(vehicleRepository.create).mockRejectedValue(unknownError);

      await expect(create('owner-1', 'parking-1', createDto)).rejects.toThrow('db failed');
    });
  });

  describe('findByPlate', () => {
    it('returns vehicle when owner has access and plate exists', async () => {
      const vehicle = buildVehicle();
      vi.mocked(parkingRepository.findById).mockResolvedValue(buildParking());
      vi.mocked(vehicleRepository.findByPlate).mockResolvedValue(vehicle);

      const result = await findByPlate('owner-1', 'ABC123', 'parking-1');

      expect(vehicleRepository.findByPlate).toHaveBeenCalledWith('ABC123', 'parking-1');
      expect(result).toEqual(vehicle);
    });

    it('throws NotFoundError when vehicle does not exist in parking', async () => {
      vi.mocked(parkingRepository.findById).mockResolvedValue(buildParking());
      vi.mocked(vehicleRepository.findByPlate).mockResolvedValue(null);

      await expect(findByPlate('owner-1', 'ABC123', 'parking-1')).rejects.toBeInstanceOf(NotFoundError);
    });

    it('throws ForbiddenError when owner is not parking owner', async () => {
      vi.mocked(parkingRepository.findById).mockResolvedValue(buildParking({ ownerId: 'owner-2' }));

      await expect(findByPlate('owner-1', 'ABC123', 'parking-1')).rejects.toBeInstanceOf(ForbiddenError);
      expect(vehicleRepository.findByPlate).not.toHaveBeenCalled();
    });
  });
});
