import { randomUUID } from 'node:crypto';

type Mergeable = Record<string, unknown>;

const merge = <T extends Mergeable>(base: T, overrides?: Partial<T>): T => {
  return { ...base, ...(overrides ?? {}) };
};

export const buildRegisterDto = (
  overrides?: Partial<{
    email: string;
    password: string;
    name: string;
  }>,
) => {
  return merge(
    {
      email: `user-${randomUUID()}@copark.test`,
      password: 'Passw0rd!123',
      name: 'Test User',
    },
    overrides,
  );
};

export const buildLoginDto = (
  overrides?: Partial<{
    email: string;
    password: string;
  }>,
) => {
  return merge(
    {
      email: 'user@copark.test',
      password: 'Passw0rd!123',
    },
    overrides,
  );
};

export const buildParking = (
  overrides?: Partial<{
    id: string;
    ownerId: string;
    pricePerHour: number;
    title: string;
    address: string;
  }>,
) => {
  return merge(
    {
      id: randomUUID(),
      ownerId: randomUUID(),
      pricePerHour: 1000,
      title: 'Main Parking',
      address: '123 Test St',
    },
    overrides,
  );
};

export const buildVehicle = (
  overrides?: Partial<{
    id: string;
    parkingId: string;
    plate: string;
    type: string;
    brand: string;
    model: string;
    customerName: string;
    customerPhone: string | null;
    notes: string | null;
  }>,
) => {
  return merge(
    {
      id: randomUUID(),
      parkingId: randomUUID(),
      plate: 'TEST123',
      type: 'CAR',
      brand: 'Toyota',
      model: 'Corolla',
      customerName: 'Customer Test',
      customerPhone: null,
      notes: null,
    },
    overrides,
  );
};
