import { db } from "../config/firebase.js";

const create = async (data) => {
  const ref = db.ref("vehicles").push();
  await ref.set(data);
  return { id: ref.key, ...data };
};

const findByUserId = async (userId) => {
  const snapshot = await db
      .ref("vehicles")
      .orderByChild("userId")
      .equalTo(userId)
      .once("value");

  const data = snapshot.val();
  return Object.entries(data).map(([key, value]) => ({ id: key, ...value }));
};

const deleteById = async (vehicleId) => {
  await db.ref(`vehicles/${vehicleId}`).remove();
};

export default { create, findByUserId, deleteById };
