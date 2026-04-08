import * as admin from 'firebase-admin';
import { writeFileSync } from 'fs';
import { join } from 'path';

const CRED_PATH = '/tmp/firebase-sa.json';

function initFirebaseAdmin() {
  if (admin.apps.length) return;

  const credsRaw = process.env.FIREBASE_ADMIN_CREDENTIALS;

  if (credsRaw) {
    // Credentials provided as JSON string (Vercel env var)
    try {
      const creds = typeof credsRaw === 'string' ? JSON.parse(credsRaw) : credsRaw;
      writeFileSync(CRED_PATH, JSON.stringify(creds), 'utf-8');
      process.env.GOOGLE_APPLICATION_CREDENTIALS = CRED_PATH;
      admin.initializeApp({
        projectId: creds.project_id,
        credential: admin.credential.cert(creds),
      });
      return;
    } catch (e) {
      console.error('[firebase-admin] Failed to init with FIREBASE_ADMIN_CREDENTIALS:', e);
    }
  }

  // On Vercel/GCP: try metadata service (no explicit credentials needed)
  if (process.env.VERCEL || process.env.NODE_ENV === 'production') {
    admin.initializeApp({ projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID });
    return;
  }

  // Local dev: require explicit credentials
  console.warn('[firebase-admin] FIREBASE_ADMIN_CREDENTIALS not set — Admin SDK disabled');
}

initFirebaseAdmin();

const db = admin.firestore();

export { db, admin };
export { Timestamp } from 'firebase-admin/firestore';
