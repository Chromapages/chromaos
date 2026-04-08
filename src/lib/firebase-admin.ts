import * as admin from 'firebase-admin';

if (!admin.apps.length) {
  // Uses Application Default Credentials — works on Vercel (bound service account)
  // and locally when GOOGLE_APPLICATION_CREDENTIALS points to a service account JSON file
  admin.initializeApp({
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  });
}

const db = admin.firestore();

export { db, admin };
export { Timestamp } from 'firebase-admin/firestore';
