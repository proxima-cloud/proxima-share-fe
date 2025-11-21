"use client";

import { useState } from 'react';
import LoginForm from '@/components/auth/LoginForm';
import RegisterDialog from '@/components/auth/RegisterDialog';

export default function LoginPage() {
  const [registerDialogOpen, setRegisterDialogOpen] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <LoginForm onOpenRegister={() => setRegisterDialogOpen(true)} />
        <RegisterDialog 
          open={registerDialogOpen} 
          onOpenChange={setRegisterDialogOpen} 
        />
      </div>
    </div>
  );
}
