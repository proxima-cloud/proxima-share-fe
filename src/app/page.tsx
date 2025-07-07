import FileUploader from '@/components/feature/file-uploader';
import AdPlaceholder from '@/components/feature/ad-placeholder';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ProximaShare | Simple & Secure File Sharing',
  description: 'Upload and share files easily with ProximaShare. Get a secure, shareable link in seconds. Fast, simple, and free file sharing.',
};

export default function Home() {
  return (
    <div className="h-full flex flex-col items-center justify-center gap-8 p-4">
      <FileUploader />
      <AdPlaceholder className="max-w-lg" />
    </div>
  );
}
