"use client";

import { useState } from 'react';
import GoogleLogin from '@/components/auth/GoogleLogin';
import { useAuth } from '@/contexts/AuthContext';

export default function TestGoogleAuth() {
  const { user, isAuthenticated } = useAuth();
  const [testResult, setTestResult] = useState<string>('');

  const testGoogleScript = () => {
    if (typeof window !== 'undefined') {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      
      script.onload = () => {
        setTestResult('Google script loaded successfully');
        console.log('Google script loaded');
      };
      
      script.onerror = () => {
        setTestResult('Failed to load Google script');
        console.error('Failed to load Google script');
      };
      
      document.head.appendChild(script);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Google OAuth Test</h1>
          <p className="text-gray-600">Testing Google OAuth integration</p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="font-semibold mb-2">Test Results:</h3>
          <p className="text-sm text-gray-600">
            Auth Status: {isAuthenticated ? 'Authenticated' : 'Not authenticated'}
          </p>
          {user && (
            <div className="mt-2">
              <p className="text-sm">User: {user.username}</p>
              <p className="text-sm">Email: {user.email}</p>
              <p className="text-sm">Name: {user.name}</p>
            </div>
          )}
          <p className="text-sm mt-2">Script Test: {testResult}</p>
        </div>

        <div className="space-y-4">
          <button
            onClick={testGoogleScript}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          >
            Test Google Script Loading
          </button>
          
          <GoogleLogin />
        </div>
      </div>
    </div>
  );
}
