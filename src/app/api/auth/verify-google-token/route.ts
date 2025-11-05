import { NextRequest, NextResponse } from 'next/server';

// This will be called as an API route on the server side
export async function POST(request: NextRequest) {
  try {
    const { idToken } = await request.json();
    
    if (!idToken) {
      return NextResponse.json(
        { error: 'No token provided' },
        { status: 400 }
      );
    }

    // Verify the token with Google on the server side
    const response = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${idToken}`);
    
    if (!response.ok) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    const tokenData = await response.json();
    
    return NextResponse.json({
      sub: tokenData.sub,
      email: tokenData.email,
      email_verified: tokenData.email_verified === 'true',
      name: tokenData.name,
      picture: tokenData.picture,
      given_name: tokenData.given_name,
      family_name: tokenData.family_name,
    });
  } catch (error) {
    console.error('Token verification error:', error);
    return NextResponse.json(
      { error: 'Failed to verify token' },
      { status: 500 }
    );
  }
}
