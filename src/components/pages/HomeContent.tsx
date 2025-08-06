'use client';

import FileUploader from '@/components/feature/file-uploader';
import AdPlaceholder from '@/components/feature/ad-placeholder';
import { PopunderProvider, usePopunderContext } from '@/providers/PopunderProvider';

function HomeContent() {
  // const { hasTriggered, sessionCount } = usePopunderContext();

  return (
    <div className="h-full flex flex-col items-center justify-center gap-8 p-4">
      <FileUploader />
      <AdPlaceholder className="max-w-lg" />
      
      {/* Debug info for development only */}
      {/* {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 right-4 text-xs text-gray-500 bg-gray-100 p-2 rounded">
          <div>Popunder: {hasTriggered ? '✅ Triggered' : '⏳ Waiting for click'}</div>
          <div>Session: {sessionCount}/1</div>
        </div>
      )} */}
    </div>
  );
}

export function HomeWithPopunder() {
  return (
    <PopunderProvider pageKey="home">
      <HomeContent />
    </PopunderProvider>
  );
}