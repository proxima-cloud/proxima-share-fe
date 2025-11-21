"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';

interface GoogleLoginProps {
  onSuccess?: () => void;
  redirectTo?: string;
}

// Google OAuth configuration
const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

if (!GOOGLE_CLIENT_ID && typeof window !== 'undefined') {
  console.warn('NEXT_PUBLIC_GOOGLE_CLIENT_ID is not set in environment variables');
}

export default function GoogleLogin({ onSuccess, redirectTo = '/dashboard' }: GoogleLoginProps) {
  const { t } = useTranslation();
  const { loginWithGoogle } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const buttonRef = useRef<HTMLDivElement>(null);
  const isInitialized = useRef(false);

  const handleGoogleCallback = useCallback(async (response: any) => {
    try {
      if (response.error) {
        throw new Error(response.error);
      }

      // The response.credential contains the JWT ID token - send it directly
      const idToken = response.credential || response.credentialResponse?.credential;
      
      if (!idToken) {
        throw new Error('No ID token received');
      }
      
      // Use AuthContext to handle the login with raw token
      const success = await loginWithGoogle(idToken);
      
      if (!success) {
        throw new Error('Failed to login with Google');
      }
      
      toast({
        title: t('auth.google.success.title'),
        description: t('auth.google.success.description'),
      });
      
      if (onSuccess) {
        onSuccess();
      } else {
        router.push(redirectTo);
      }
      
    } catch (error) {
      console.error('Google login error:', error);
      setError(t('auth.google.error.generic'));
    } finally {
      setIsLoading(false);
    }
  }, [loginWithGoogle, toast, t, onSuccess, router, redirectTo]);

  // Initialize Google Sign-In on mount
  useEffect(() => {
    const initializeGoogleSignIn = async () => {
      if (isInitialized.current || !GOOGLE_CLIENT_ID) return;
      
      try {
        await loadGoogleScript();
        
        if (!window.google?.accounts?.id) {
          console.error('Google OAuth not available');
          return;
        }
        
        // Initialize Google Sign-In
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: handleGoogleCallback,
          auto_select: false,
          cancel_on_tap_outside: true,
          use_fedcm_for_prompt: true,
        });
        
        isInitialized.current = true;
      } catch (error) {
        console.error('Failed to initialize Google OAuth:', error);
      }
    };

    initializeGoogleSignIn();
  }, [handleGoogleCallback]);

  const handleGoogleLogin = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    setError('');

    try {
      // Load Google OAuth script if not already loaded
      await loadGoogleScript();
      
      // Check if Google OAuth is available
      if (!window.google?.accounts?.id) {
        throw new Error('Google OAuth not available');
      }

      if (!GOOGLE_CLIENT_ID) {
        throw new Error('Google Client ID not configured');
      }
      
      // Initialize Google Sign-In if not already initialized
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleGoogleCallback,
        auto_select: false,
        cancel_on_tap_outside: true,
      });

      // Use prompt to show the Google Sign-In prompt
      window.google.accounts.id.prompt((notification: any) => {
        console.log("----------------------------------", notification);
        if (notification.isNotDisplayed()) {
          const reason = notification.getNotDisplayedReason();
          console.error('Google Sign-In not displayed:', reason);
          if (reason === 'browser_not_supported' || reason === 'invalid_client') {
            setError('Google Sign-In is not available. Please check your browser and configuration.');
          } else if (reason === 'unknown_reason') {
            setError('Unable to display Google Sign-In. Please ensure your domain is authorized in Google Cloud Console.');
          } else {
            setError(`Google Sign-In error: ${reason}. Please check your Google Cloud Console configuration.`);
          }
          setIsLoading(false);
        } else if (notification.isSkippedMoment()) {
          setIsLoading(false);
        }
      });
    } catch (error: any) {
      console.error('Google OAuth error:', error);
      setError(error.message || t('auth.google.error.generic'));
      setIsLoading(false);
    }
  };



  const loadGoogleScript = (): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (window.google?.accounts?.id) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      
      script.onload = () => {
        // Wait a bit for Google to initialize
        setTimeout(() => {
          if (window.google?.accounts?.id) {
            resolve();
          } else {
            reject(new Error('Google OAuth failed to initialize'));
          }
        }, 100);
      };
      
      script.onerror = () => reject(new Error('Failed to load Google OAuth script'));
      
      document.head.appendChild(script);
    });
  };

  return (
    <>
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <div id="google-signin-button" className="w-full flex justify-center">
        <Button 
          onClick={handleGoogleLogin}
          disabled={isLoading || !GOOGLE_CLIENT_ID}
          className="w-full"
          variant="outline"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {t('auth.google.signingIn')}
            </>
          ) : (
            <>
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              {t('auth.google.button')}
            </>
          )}
        </Button>
      </div>
      
      {!GOOGLE_CLIENT_ID && (
        <p className="text-xs text-muted-foreground mt-2 text-center">
          Google Sign-In is not configured. Please set NEXT_PUBLIC_GOOGLE_CLIENT_ID environment variable.
        </p>
      )}
    </>
  );
}
