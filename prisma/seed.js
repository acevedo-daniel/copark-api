import pkg from "@prisma/client";
const { PrismaClient } = pkg;
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import argon2 from "argon2";
import "dotenv/config";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Starting seeding...");

  // Clean Database
  await prisma.review.deleteMany().catch(() => {});
  await prisma.booking.deleteMany();
  await prisma.vehicle.deleteMany();

  await prisma.parking.deleteMany();
  await prisma.user.deleteMany();
  console.log("🧹 Cleaned up database");

  // Create Admin
  const adminEmail = "admin@copark.com";
  const passwordHash = await argon2.hash("123456");

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      passwordHash,
      name: "Admin",
      lastName: "CoPark",
      phone: "+541112345678",
    },
  });

  console.log(`👤 Created user: ${admin.email}`);

  const parkings = [
    {
      title: "Cochera Centro Histórico",
      address: "Av. Corrientes 1234, Buenos Aires",
      pricePerHour: 1500,
      totalSpaces: 20,
      lat: -34.6037,
      lng: -58.3816,
      ownerId: admin.id,
      image: "https://images.pexels.com/photos/70912/pexels-photo-70912.jpeg",
    },
    {
      title: "Estacionamiento Puerto Madero",
      address: "Alicia Moreau de Justo 500, Buenos Aires",
      pricePerHour: 2500,
      totalSpaces: 50,
      lat: -34.61,
      lng: -58.365,
      ownerId: admin.id,
      image:
        "https://images.pexels.com/photos/1280560/pexels-photo-1280560.jpeg",
    },
    {
      title: "Garage Palermo Soho",
      address: "Malabia 1700, Buenos Aires",
      pricePerHour: 1800,
      totalSpaces: 15,
      lat: -34.5889,
      lng: -58.4233,
      ownerId: admin.id,
      image: "https://images.pexels.com/photos/164634/pexels-photo-164634.jpeg",
    },
    {
      title: "Estacionamiento Belgrano R",
      address: "Av. Cabildo 2400, Buenos Aires",
      pricePerHour: 2100,
      totalSpaces: 30,
      lat: -34.5611,
      lng: -58.4566,
      ownerId: admin.id,
      image: "https://images.pexels.com/photos/3313988/pexels-photo-3313988.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    },
    {
      title: "Parking San Telmo",
      address: "Defensa 800, Buenos Aires",
      pricePerHour: 1600,
      totalSpaces: 10,
      lat: -34.6186,
      lng: -58.3712,
      ownerId: admin.id,
      image: "https://images.pexels.com/photos/1004409/pexels-photo-1004409.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    },
    {
      title: "Recoleta Mall Parking",
      address: "Vicente López 2050, Buenos Aires",
      pricePerHour: 3000,
      totalSpaces: 100,
      lat: -34.5866,
      lng: -58.3913,
      ownerId: admin.id,
      image: "https://images.pexels.com/photos/1756957/pexels-photo-1756957.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    },
  ];

  for (const p of parkings) {
    const created = await prisma.parking.create({
      data: p,
    });
    console.log(`🅿️ Created parking: ${created.title}`);
  }

  console.log("✅ Seeding completed.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
