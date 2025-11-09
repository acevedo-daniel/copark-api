import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import admin from 'firebase-admin';
import { Timestamp } from 'firebase-admin/firestore';
import functions from 'firebase-functions/v1';

dotenv.config();

// Inicializa Admin SDK
if (!admin.apps.length) {
  admin.initializeApp();
}
const db = admin.firestore();
// const rtdb = admin.database();

// App Express
const app = express();
app.use(cors());
app.use(express.json());

// Ping endpoint
app.get('/ping', (req, res) => {
  res.json({ message: 'Copark API Online 🚀' });
});

// Health endpoint
app.get('/health', async (req, res) => {
  try {
    const dateNow = new Date().toISOString();
    await db.collection('_health').doc('last').set({ dateNow }, { merge: true });
    const snap = await db.collection('_health').doc('last').get();
    const data = snap.exists ? snap.data() : null;

    res.json({
      ok: true,
      projectId: process.env.GCLOUD_PROJECT || process.env.FUNCTIONS_EMULATOR,
      firestoreWriteRead: !!data,
      dateNow,
    });
  } catch (err) {
    res.status(500).json({ ok: false, error: String(err) });
  }
});

// Time endpoint
app.get('/time', (req, res) => {
  const timestamp = Timestamp.now();
  const millis = timestamp.toMillis();

  res.json({
    serverTime: millis,
  });
});

// Exportar función HTTP (región suramérica)
export const api = functions.region('southamerica-east1').https.onRequest(app);
