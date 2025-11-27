import userService from "../services/users.service.js";
import vehicleService from "../services/vehicles.service.js";
import parkingService from "../services/parkings.service.js";

const seedDatabase = async (req, res, next) => {
  try {
    const ownerId = "owner_1";
    await userService.updateUser(ownerId, {
      fullName: "Juan Dueño",
      email: "juan@park.com",
      phone: "1122334455",
    });

    const driverId = "driver_1";
    await userService.updateUser(driverId, {
      fullName: "Pepe Conductor",
      email: "pepe@drive.com",
      phone: "9988776655",
    });

    await vehicleService.addVehicle(driverId, {
      brand: "Toyota",
      model: "Corolla",
      plate: "AB123CD",
      type: "SEDAN",
    });

    await parkingService.publishParking(ownerId, {
      title: "Cochera Centro Seguro",
      address: "Av. Corrientes 1234",
      pricePerHour: 500,
      totalSpaces: 5,
      lat: -34.6037,
      lng: -58.3816,
    });

    res.json({ message: "✅ Base de datos sembrada con éxito" });
  } catch (error) {
    next(error);
  }
};

export default { seedDatabase };
