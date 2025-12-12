const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      const errorMessage = error.details
          .map((detail) => detail.message)
          .join(", ");

      return next({
        statusCode: 400,
        message: errorMessage,
      });
    }
    next();
  };
};

export default validate;
