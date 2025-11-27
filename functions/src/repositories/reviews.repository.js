import { db } from "../config/firebase.js";

const create = async (data) => {
  const ref = db.ref("reviews").push();
  await ref.set(data);
  return { id: ref.key, ...data };
};

const findByParkingId = async (parkingId) => {
  const snapshot = await db
      .ref("reviews")
      .orderByChild("parkingId")
      .equalTo(parkingId)
      .once("value");

  const data = snapshot.val();
  if (!data) return [];
  return Object.entries(data).map(([key, value]) => ({ id: key, ...value }));
};

export default { create, findByParkingId };
