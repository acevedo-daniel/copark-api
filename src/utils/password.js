import argon2 from "argon2";

export const hashPassword = (password) => {
  return argon2.hash(password);
};

export const verifyPassword = (hash, password) => {
  return argon2.verify(hash, password);
};
