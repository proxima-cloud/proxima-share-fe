import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { DashboardContent } from '@/components/dashboard/DashboardContent';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard | ProximaShare',
  description: 'Manage your files and account settings.',
};

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}
