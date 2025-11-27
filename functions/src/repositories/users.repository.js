import { db } from "../config/firebase.js";

const save = async (uid, userData) => {
  await db.ref(`users/${uid}`).set(userData);
  return { uid, ...userData };
};

const findById = async (uid) => {
  const snapshot = await db.ref(`users/${uid}`).once("value");
  return snapshot.val();
};

export default { save, findById };
