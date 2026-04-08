import { db } from '@/lib/firebase-admin';
import { createClientFolder } from '../createClientFolder';

export async function checkMissingFolders() {
  const snap = await db.collection('leads')
    .where('status', '==', 'customer')
    .get();

  const results: string[] = [];

  for (const doc of snap.docs) {
    const data = doc.data();
    // Skip if folder already exists
    if (data.clientFolderPath) continue;

    const companyName = data.companyName || data.fullName || 'Unknown';
    try {
      // Auto-create the folder
      const { folderPath } = await createClientFolder(companyName);
      // Update lead with folder path
      await doc.ref.update({ clientFolderPath: folderPath });
      results.push(doc.id);
    } catch (err) {
      console.error(`Failed to create folder for lead ${doc.id}:`, err);
    }
  }

  return { checked: snap.size, foldersCreated: results.length };
}
