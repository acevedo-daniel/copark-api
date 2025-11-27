import { db } from "../config/firebase.js";

const create = async (data) => {
  const ref = db.ref("bookings").push();
  await ref.set(data);
  return { id: ref.key, ...data };
};

const findByUserId = async (uid) => {
  const snapshot = await db
      .ref("bookings")
      .orderByChild("driverId")
      .equalTo(uid)
      .once("value");

  const data = snapshot.val();
  if (!data) return [];
  return Object.entries(data).map(([key, value]) => ({ id: key, ...value }));
};

const cancel = async (bookingId) => {
  await db.ref(`bookings/${bookingId}`).update({
    status: "CANCELLED",
  });
  return { id: bookingId, status: "CANCELLED" };
};

export default { create, findByUserId, cancel };
