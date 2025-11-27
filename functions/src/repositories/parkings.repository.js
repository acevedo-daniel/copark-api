import { db } from "../config/firebase.js";

const create = async (data) => {
  const ref = db.ref("parkings").push();
  await ref.set(data);
  return { id: ref.key, ...data };
};

const findAll = async () => {
  const snapshot = await db.ref("parkings").once("value");
  const data = snapshot.val();
  if (!data) return [];
  return Object.entries(data).map(([key, value]) => ({ id: key, ...value }));
};

const findById = async (parkingId) => {
  const snapshot = await db.ref(`parkings/${parkingId}`).once("value");
  return snapshot.val();
};

const findByOwnerId = async (ownerId) => {
  const snapshot = await db
      .ref("parkings")
      .orderByChild("ownerId")
      .equalTo(ownerId)
      .once("value");

  const data = snapshot.val();
  if (!data) return [];
  return Object.entries(data).map(([key, value]) => ({ parkingId: key, ...value }));
};

const update = async (parkingId, data) => {
  await db.ref(`parkings/${parkingId}`).update(data);
  return { id: parkingId, ...data };
};

export default { create, findAll, findById, findByOwnerId, update };
