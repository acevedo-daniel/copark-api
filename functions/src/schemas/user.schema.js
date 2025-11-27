import Joi from "joi";

const updateProfile = Joi.object({
  name: Joi.string().min(2).max(50).trim().messages({
    "string.base": "El nombre debe ser texto",
    "string.min": "El nombre debe tener al menos 2 caracteres",
  }),

  lastName: Joi.string().min(2).max(50).trim().messages({
    "string.base": "El apellido debe ser texto",
    "string.min": "El apellido debe tener al menos 2 caracteres",
  }),

  phone: Joi.string()
      .pattern(/^[0-9]+$/)
      .min(8)
      .max(15)
      .trim()
      .messages({
        "string.pattern.base": "El teléfono solo debe contener números",
      }),

  photoUrl: Joi.string().uri().optional(),
})
    .min(1)
    .messages({
      "object.min": "Debes enviar al menos un campo para actualizar",
    });

export default { updateProfile };
