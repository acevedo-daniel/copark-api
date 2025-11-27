import functions from "firebase-functions";
import app from "./app.js";

export { onBookingCreate } from "./src/triggers/notifications.trigger.js";
export { onReviewCreate } from "./src/triggers/ratings.trigger.js";

export const api = functions.https.onRequest(app);
