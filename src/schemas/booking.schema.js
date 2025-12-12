import Joi from "joi";

const createBooking = Joi.object({
  parkingId: Joi.string().required(),
  vehicleId: Joi.string().allow(null, "").optional(),
  startTime: Joi.date().iso().required(),
  endTime: Joi.date().iso().greater(Joi.ref("startTime")).required(),
});

export default { createBooking };
