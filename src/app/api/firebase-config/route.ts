import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // Get Firebase config from environment variables
  const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
  };

  // Validate that required config is present
  if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
    return NextResponse.json(
      { error: 'Firebase configuration not available' },
      { status: 500 }
    );
  }

  return NextResponse.json(firebaseConfig);
}
