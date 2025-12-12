import Joi from "joi";

const createReview = Joi.object({
  parkingId: Joi.string().required(),
  rating: Joi.number().integer().min(1).max(5).required(),
  comment: Joi.string().min(5).max(200).required(),
});

export default { createReview };
