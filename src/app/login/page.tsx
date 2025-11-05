"use client";

import { useState } from 'react';
import LoginForm from '@/components/auth/LoginForm';
import RegisterDialog from '@/components/auth/RegisterDialog';

export default function LoginPage() {
  const [registerDialogOpen, setRegisterDialogOpen] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">ProximaShare</h1>
          <p className="text-gray-600">Sign in to your account</p>
        </div>
        <LoginForm onOpenRegister={() => setRegisterDialogOpen(true)} />
        <RegisterDialog 
          open={registerDialogOpen} 
          onOpenChange={setRegisterDialogOpen} 
        />
      </div>
    </div>
  );
}
