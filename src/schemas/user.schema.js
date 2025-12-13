import Joi from "joi";

const updateProfile = Joi.object({
  name: Joi.string().min(2).max(50).trim().messages({
    "string.base": "Name must be text",
    "string.min": "Name must be at least 2 characters",
  }),

  lastName: Joi.string().min(2).max(50).trim().messages({
    "string.base": "Last name must be text",
    "string.min": "Last name must be at least 2 characters",
  }),

  phone: Joi.string()
      .pattern(/^[0-9]+$/)
      .min(8)
      .max(15)
      .trim()
      .messages({
        "string.pattern.base": "Phone must contain only numbers",
      }),

  photoUrl: Joi.string().uri().optional(),
})
    .min(1)
    .messages({
      "object.min": "At least one field must be provided to update",
    });

export default { updateProfile };
