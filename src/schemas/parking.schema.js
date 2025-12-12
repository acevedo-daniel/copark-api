import Joi from "joi";

const publishParking = Joi.object({
  title: Joi.string().min(5).max(50).required(),
  address: Joi.string().required(),
  pricePerHour: Joi.number().min(0).required(),
  totalSpaces: Joi.number().integer().min(1).required(),
  lat: Joi.number().min(-90).max(90).required(),
  lng: Joi.number().min(-180).max(100).required(),
});

const updateParking = Joi.object({
  title: Joi.string().min(5).max(50),
  address: Joi.string(),
  pricePerHour: Joi.number().min(0),
  totalSpaces: Joi.number().integer().min(1),
  lat: Joi.number().min(-90).max(90),
  lng: Joi.number().min(-180).max(100),
}).min(1);

export default { publishParking, updateParking };
