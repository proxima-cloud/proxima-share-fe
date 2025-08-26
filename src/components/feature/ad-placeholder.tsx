import { cn } from "@/lib/utils";

export default function AdPlaceholder({ className }: { className?: string }) {
  return (
    <a href="https://www.profitableratecpm.com/vz23hychc?key=90b6a685772e36eadffa06a203a0d21d"
      target="_blank"
      className={cn(
        "flex h-[100px] w-full items-center justify-center rounded-lg border-2 border-dashed bg-muted/50 p-4 text-center text-sm text-muted-foreground",
        className
      )}
    >
      <div
        className="flex h-full w-full justify-center rounded-lg"
      >
        <img
          src="/images/do_not_touch.jpg"
          alt="Ad"
          className="h-full rounded-lg"
        />
      </div>
    </a>
  );
}
