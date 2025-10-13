import { initializeApp, getApp, getApps, cert } from 'firebase-admin/app';

const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY
  ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY)
  : undefined;

// This is a singleton to ensure we only initialize the app once
export function getFirebaseAdminApp() {
  if (getApps().length) {
    return getApp();
  }

  if (!serviceAccount) {
    throw new Error(
      'FIREBASE_SERVICE_ACCOUNT_KEY environment variable not set. ' +
      'Please create a service account and set the key in your environment.'
    );
  }

  return initializeApp({
    credential: cert(serviceAccount),
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  });
}
