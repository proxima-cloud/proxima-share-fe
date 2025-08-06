import FileUploader from '@/components/feature/file-uploader';
import AdPlaceholder from '@/components/feature/ad-placeholder';
import { HomeWithPopunder } from '@/components/pages/HomeContent';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ProximaShare | Simple & Secure File Sharing',
  description: 'Upload and share files easily with ProximaShare. Get a secure, shareable link in seconds. Fast, simple, and free file sharing.',
};

// Server component - keeps metadata export working
export default function Home() {
  return <HomeWithPopunder />;
}