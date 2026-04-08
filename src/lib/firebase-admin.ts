import * as admin from 'firebase-admin';
import { writeFileSync } from 'fs';
import { join } from 'path';

function initFirebaseAdmin() {
  if (admin.apps.length) return;

  const credsJson = process.env.FIREBASE_ADMIN_CREDENTIALS;

  // If credentials are passed as a JSON string, write to a temp file
  // Firebase Admin SDK reads GOOGLE_APPLICATION_CREDENTIALS on first use
  if (credsJson) {
    const tempCredPath = join('/tmp', 'firebase-sa.json');
    writeFileSync(tempCredPath, credsJson, 'utf-8');
    process.env.GOOGLE_APPLICATION_CREDENTIALS = tempCredPath;
  }

  admin.initializeApp({
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  });
}

// Initialize on module load
initFirebaseAdmin();

const db = admin.firestore();

export { db, admin };
export { Timestamp } from 'firebase-admin/firestore';
