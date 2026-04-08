import * as admin from 'firebase-admin';
import { readFileSync, writeFileSync, unlinkSync } from 'fs';
import { join } from 'path';

let dbInstance: admin.firestore.Firestore | null = null;
let credFilePath: string | null = null;

function initFirebaseAdmin() {
  if (admin.apps.length) return;

  const credsJson = process.env.FIREBASE_ADMIN_CREDENTIALS;
  const credsPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;

  if (credsJson && !credsPath) {
    // Vercel: credentials passed as JSON string env var
    // Write to temp file so firebase-admin can read it
    credFilePath = join('/tmp', `firebase-sa-${Date.now()}.json`);
    writeFileSync(credFilePath, credsJson, 'utf-8');
    process.env.GOOGLE_APPLICATION_CREDENTIALS = credFilePath;
  }

  let credential: admin.credential.Credential;

  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    // Local or Vercel with file-based credentials
    credential = admin.credential.applicationDefault();
  } else {
    // Fallback — try without explicit credentials
    // Works on GCP (Cloud Run, GCE, GCF) with attached service account
    credential = admin.credential.applicationDefault();
  }

  admin.initializeApp({
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    credential,
  });

  // Clean up temp credentials file after initialization
  if (credFilePath) {
    try {
      unlinkSync(credFilePath);
      credFilePath = null;
    } catch {
      // ignore cleanup errors
    }
  }
}

function getDb(): admin.firestore.Firestore {
  if (!dbInstance) {
    initFirebaseAdmin();
    dbInstance = admin.firestore();
  }
  return dbInstance;
}

const db = new Proxy({} as admin.firestore.Firestore, {
  get(_, prop) {
    return (getDb() as any)[prop];
  },
});

export { db, admin };
export { Timestamp } from 'firebase-admin/firestore';
