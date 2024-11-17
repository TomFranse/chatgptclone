import { getServerSession } from "next-auth/next";
import { authOptions } from "../[...nextauth]/route";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ 
        status: "unauthenticated",
        message: "No session found"
      });
    }

    // Try to access Firebase Admin
    const { adminDb } = await import('@/lib/firebase/firebaseAdmin');
    const testDoc = await adminDb.collection('test').doc('test').get();

    return NextResponse.json({ 
      status: "authenticated",
      session,
      firebaseTest: "success",
      message: "Both NextAuth and Firebase are working"
    });

  } catch (error) {
    console.error('Auth Test Error:', error);
    return NextResponse.json({ 
      status: "error",
      message: error instanceof Error ? error.message : "Unknown error",
      error
    }, { status: 500 });
  }
}