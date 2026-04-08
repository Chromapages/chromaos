import * as admin from 'firebase-admin';

function initFirebaseAdmin() {
  if (admin.apps.length) return;

  // On Vercel (Google Cloud infra): use Application Default Credentials
  // The metadata service provides credentials automatically — no file needed.
  if (process.env.VERCEL || process.env.NODE_ENV === 'production') {
    admin.initializeApp({
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    });
  } else {
    // Local dev: require explicit credentials via env var
    const credsJson = process.env.FIREBASE_ADMIN_CREDENTIALS;
    if (!credsJson) {
      console.warn('[firebase-admin] FIREBASE_ADMIN_CREDENTIALS not set — Firestore Admin writes disabled');
      return;
    }
    try {
      const parsed = JSON.parse(credsJson);
      admin.initializeApp({
        projectId: parsed.project_id,
        credential: admin.credential.cert(parsed),
      });
    } catch (e) {
      console.warn('[firebase-admin] Failed to parse FIREBASE_ADMIN_CREDENTIALS:', e);
    }
  }
}

initFirebaseAdmin();

const db = admin.firestore();

export { db, admin };
export { Timestamp } from 'firebase-admin/firestore';
