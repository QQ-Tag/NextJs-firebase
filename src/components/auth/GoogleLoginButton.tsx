'use client';

import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';

// Define a simple SVG for Google icon
const GoogleIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 48 48"
    width="16px"
    height="16px"
  >
    <path
      fill="#EA4335"
      d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
    />
    <path
      fill="#4285F4"
      d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
    />
    <path
      fill="#FBBC05"
      d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
    />
    <path
      fill="#34A853"
      d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
    />
    <path fill="none" d="M0 0h48v48H0z" />
  </svg>
);

declare global {
  interface Window {
    google: any;
  }
}

export function GoogleLoginButton() {
  const { toast } = useToast();
  const { googleLogin } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      const google = window.google;
      if (!google) {
        throw new Error('Google Sign-In not loaded');
      }

      google.accounts.id.initialize({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
        callback: async (response: any) => {
          try {
            const user = await googleLogin(response.credential);
            if (user) {
              toast({
                title: 'Login Successful',
                description: `Welcome, ${user.name}!`,
              });
            }
          } catch (error: any) {
            toast({
              variant: 'destructive',
              title: 'Google Login Failed',
              description: error.message || 'Failed to sign in with Google.',
            });
          } finally {
            setIsLoading(false);
          }
        },
      });

      const tempDiv = document.createElement('div');
      document.body.appendChild(tempDiv);

      google.accounts.id.renderButton(tempDiv, {
        theme: 'outline',
        size: 'large',
      });

      setTimeout(() => {
        const googleBtn = tempDiv.querySelector(
          'div[role="button"]'
        ) as HTMLElement;
        if (googleBtn) {
          googleBtn.click();
        }
        document.body.removeChild(tempDiv);
      }, 100);
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Google Login Error',
        description: error.message || 'Failed to initialize Google Sign-In.',
      });
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="outline"
      className="w-full h-9 border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300 text-gray-700 hover:text-gray-900 rounded-lg transition-all duration-300 transform hover:-translate-y-0.5 text-xs font-medium"
      onClick={handleGoogleLogin}
      disabled={isLoading}
    >
      {isLoading ? (
        <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin text-gray-600" />
      ) : (
        <GoogleIcon />
      )}
      <span className="ml-1.5">
        {isLoading ? 'Signing in...' : 'Continue with Google'}
      </span>
    </Button>
  );
}