import { cn } from "@/lib/utils";
import AdBanner from "./ad-banner";

export default function AdPlaceholder({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex h-[100px] w-full items-center justify-center rounded-lg border-2 border-dashed bg-muted/50 p-4 text-center text-sm text-muted-foreground",
        className
      )}
    >
      < AdBanner />
    </div>
  );
}
