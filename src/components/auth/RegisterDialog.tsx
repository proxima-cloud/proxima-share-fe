"use client";

import RegisterForm from './RegisterForm';
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';

interface RegisterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  redirectTo?: string;
  onOpenLogin?: () => void;
}

export default function RegisterDialog({ open, onOpenChange, redirectTo = '/dashboard', onOpenLogin }: RegisterDialogProps) {
  const handleSuccess = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-hidden p-0 gap-0">
        <div className="overflow-y-auto max-h-[90vh]">
          <RegisterForm onSuccess={handleSuccess} redirectTo={redirectTo} onOpenLogin={onOpenLogin} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
