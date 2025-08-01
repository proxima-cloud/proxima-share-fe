import DownloadUI from "@/components/feature/download-ai";
import { Loader2 } from "lucide-react";
import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Download File | ProximaShare",
  description: "Download your shared file from ProximaShare",
};

const LoadingSpinner = () => (
  <div className="flex flex-col items-center justify-center h-full gap-4">
    <Loader2 className="h-8 w-8 animate-spin text-primary" />
    <p className="text-muted-foreground">Loading file details...</p>
  </div>
);

export default function DownloadPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <DownloadUI uuid="" />
    </Suspense>
  );
}
