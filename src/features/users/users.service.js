import * as userRepository from "./users.repository.js";

export const getUser = async (uid) => {
  const user = await userRepository.findById(uid);
  if (!user) throw new Error("USER_NOT_FOUND");
  return user;
};

export const updateUser = async (uid, userData) => {
  return await userRepository.save(uid, userData);
};
