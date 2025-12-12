import * as usersService from "./users.service.js";

export const getMe = async (req, res, next) => {
  try {
    const uid = req.user.uid;
    const user = await usersService.getUser(uid);
    res.json(user);
  } catch (error) {
    next(error);
  }
};

export const updateMe = async (req, res, next) => {
  try {
    const uid = req.user.uid;
    const data = req.body;
    const updatedUser = await usersService.updateUser(uid, data);
    res.json(updatedUser);
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await usersService.getUser(id);
    res.json(user);
  } catch (error) {
    next(error);
  }
};
