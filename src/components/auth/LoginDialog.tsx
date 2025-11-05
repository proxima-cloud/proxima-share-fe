"use client";

import LoginForm from './LoginForm';
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';

interface LoginDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  redirectTo?: string;
  onOpenRegister?: () => void;
}

export default function LoginDialog({ open, onOpenChange, redirectTo = '/dashboard', onOpenRegister }: LoginDialogProps) {
  const handleSuccess = () => {
    onOpenChange(false);
  };

  const handleOpenRegister = () => {
    onOpenChange(false);
    if (onOpenRegister) {
      onOpenRegister();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-hidden p-0 gap-0">
        <div className="overflow-y-auto max-h-[90vh]">
          <LoginForm onSuccess={handleSuccess} redirectTo={redirectTo} onOpenRegister={handleOpenRegister} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
