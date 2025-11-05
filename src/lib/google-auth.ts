const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

if (!GOOGLE_CLIENT_ID && typeof window !== 'undefined') {
  console.warn('NEXT_PUBLIC_GOOGLE_CLIENT_ID is not set in environment variables');
}

export interface GoogleUserInfo {
  iss: string;
  azp: string;
  aud: string;
  sub: string;
  email: string;
  email_verified: boolean;
  nbf: number;
  name: string;
  picture: string;
  given_name: string;
  family_name: string;
  iat: number;
  exp: number;
  jti: string;
}

/**
 * Verifies a Google ID token by calling the server-side API
 * @param idToken - The Google ID token to verify
 * @returns Promise<GoogleUserInfo> - The verified user information
 */
export async function verifyGoogleToken(idToken: string): Promise<GoogleUserInfo> {
  try {
    // Call our API route to verify the token server-side
    const response = await fetch('/api/auth/verify-google-token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ idToken }),
    });

    if (!response.ok) {
      throw new Error('Token verification failed');
    }

    const data = await response.json();
    
    // Return the verified user info
    return {
      iss: 'https://accounts.google.com',
      azp: GOOGLE_CLIENT_ID,
      aud: GOOGLE_CLIENT_ID,
      sub: data.sub,
      email: data.email,
      email_verified: data.email_verified,
      nbf: Math.floor(Date.now() / 1000),
      name: data.name,
      picture: data.picture,
      given_name: data.given_name,
      family_name: data.family_name,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 3600,
      jti: data.sub,
    };
  } catch (error) {
    console.error('Google token verification failed:', error);
    throw new Error('Invalid Google token');
  }
}

/**
 * Sends Google user info to backend for registration/login
 * @param googleUserInfo - The verified Google user information
 * @returns Promise<any> - The backend response
 */
export async function registerWithGoogle(googleUserInfo: GoogleUserInfo): Promise<any> {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  
  if (!API_BASE_URL) {
    throw new Error('NEXT_PUBLIC_API_BASE_URL is not set in environment variables');
  }
  
  try {
    const response = await fetch(`${API_BASE_URL}/auth/register/google/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(googleUserInfo),
    });

    if (!response.ok) {
      throw new Error(`Backend error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Backend registration failed:', error);
    throw new Error('Failed to register with backend');
  }
}
