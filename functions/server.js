import functions from "firebase-functions";
import app from "./app.js";

import { onBookingCreate } from "./src/triggers/notifications.trigger.js";
import { onReviewCreate } from "./src/triggers/ratings.trigger.js";

export const api = functions.https.onRequest(app);

export { onBookingCreate, onReviewCreate };
