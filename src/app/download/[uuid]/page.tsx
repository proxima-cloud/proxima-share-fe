import DownloadUI from "@/components/feature/download-ui";
import { Loader2 } from "lucide-react";
import type { Metadata } from "next";
import { Suspense } from "react";

type DownloadPageProps = {
  params: {
    uuid: string;
  };
};

export async function generateMetadata({
  params,
}: DownloadPageProps): Promise<Metadata> {
  return {
    title: `Download File | ProximaShare`,
    description: `Download your file with ID: ${params.uuid}`,
  };
}

const LoadingSpinner = () => (
  <div className="flex flex-col items-center justify-center h-full gap-4">
    <Loader2 className="h-8 w-8 animate-spin text-primary" />
    <p className="text-muted-foreground">Loading file details...</p>
  </div>
);

export default async function DownloadPage({ params }: DownloadPageProps) {
  const { uuid } = params;
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <DownloadUI uuid={uuid} />
    </Suspense>
  );
}
