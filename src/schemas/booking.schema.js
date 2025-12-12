import Joi from "joi";

const createBooking = Joi.object({
  parkingId: Joi.string().required(),
  vehicleId: Joi.string().required(),
  startTime: Joi.date().iso().greater("now").required(),
  endTime: Joi.date().iso().greater(Joi.ref("startTime")).required(),
});

export default { createBooking };
