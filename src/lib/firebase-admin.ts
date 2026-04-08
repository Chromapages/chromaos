import * as admin from 'firebase-admin';
import { writeFileSync, unlinkSync, existsSync } from 'fs';
import { join } from 'path';

function initFirebaseAdmin() {
  if (admin.apps.length) return;

  const credsJson = process.env.FIREBASE_ADMIN_CREDENTIALS;
  const credsPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
  const tempCredPath = join('/tmp', 'firebase-sa.json');

  // If credentials are passed as a JSON string, write to a temp file
  if (credsJson) {
    writeFileSync(tempCredPath, credsJson, 'utf-8');
    process.env.GOOGLE_APPLICATION_CREDENTIALS = tempCredPath;
  }

  admin.initializeApp({
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  });

  // Clean up temp credentials file after initializeApp succeeds
  if (credsJson && existsSync(tempCredPath)) {
    try {
      unlinkSync(tempCredPath);
    } catch {
      // ignore cleanup errors
    }
  }
}

// Initialize on module load — this runs once when the server starts
initFirebaseAdmin();

const db = admin.firestore();

export { db, admin };
export { Timestamp } from 'firebase-admin/firestore';
