import Joi from "joi";
const createVehicle = Joi.object({
  brand: Joi.string().required(),
  model: Joi.string().required(),
  plate: Joi.string().uppercase().min(6).max(7).required(),
  type: Joi.string().valid("CAR", "MOTORCYCLE", "BUS", "TRUCK").required(),
});

export default { createVehicle };
