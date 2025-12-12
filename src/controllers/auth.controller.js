import * as authService from "../services/auth.service.js";

export const register = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await authService.register({ email, password });
    return res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await authService.login({ email, password });
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
