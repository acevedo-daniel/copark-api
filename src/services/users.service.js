import userRepository from "../repositories/users.repository.js";

const getUser = async (uid) => {
  const user = await userRepository.findById(uid);
  if (!user) throw new Error("USER_NOT_FOUND");
  return user;
};

const updateUser = async (uid, userData) => {
  return await userRepository.save(uid, userData);
};

export default { getUser, updateUser };
