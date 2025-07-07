"use client";

import AdPlaceholder from "@/components/feature/ad-placeholder";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
    Check,
    Copy,
    Download,
    Link as LinkIcon,
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

export default function DownloadUI({ uuid }: { uuid: string }) {
    const searchParams = useSearchParams();
    const fileName = searchParams.get("name");
    const downloadUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/files/download/${uuid}`;
    const [copied, setCopied] = useState(false);
    const { toast } = useToast();

    const handleCopy = () => {
        navigator.clipboard.writeText(uuid).then(() => {
            setCopied(true);
            toast({
                title: "Copied!",
                description: "File ID copied to clipboard.",
            });
            setTimeout(() => setCopied(false), 3000);
        });
    };

    return (
        <div className="flex h-full w-full flex-col items-center justify-center gap-8 p-4">
            <Card className="w-full max-w-md shadow-lg">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-center">
                        Your File is Ready
                    </CardTitle>
                    <CardDescription className="text-center truncate px-4">
                        {fileName || "File ready to download"}
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="uuid-input">File ID</Label>
                        <div className="relative">
                            <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="uuid-input"
                                value={uuid}
                                readOnly
                                className="pl-10 pr-10"
                            />
                            <Button
                                size="icon"
                                variant="ghost"
                                className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
                                onClick={handleCopy}
                            >
                                {copied ? (
                                    <Check className="h-4 w-4 text-success" />
                                ) : (
                                    <Copy className="h-4 w-4" />
                                )}
                            </Button>
                        </div>
                    </div>
                    <Button asChild className="w-full">
                        <a href={downloadUrl} target="_blank" rel="noopener noreferrer">
                            <Download className="mr-2 h-4 w-4" />
                            Download File
                        </a>
                    </Button>
                </CardContent>
                <CardFooter>
                    <p className="text-xs text-muted-foreground text-center w-full">
                        The download will start in a new tab.
                    </p>
                </CardFooter>
            </Card>
            <AdPlaceholder className="max-w-md" />
        </div>
    );
}
