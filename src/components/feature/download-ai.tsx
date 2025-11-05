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
import { useAuth } from '@/contexts/AuthContext';
import { Check, Clipboard, Download, Link as LinkIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";

export default function DownloadUI({ uuid: initialUuid }: { uuid?: string }) {
	const { t } = useTranslation();
	const { isAuthenticated, token } = useAuth();
	const [inputValue, setInputValue] = useState(initialUuid || "");
	const [downloadUrl, setDownloadUrl] = useState("");
	const [pasted, setPasted] = useState(false);
	const { toast } = useToast();

	useEffect(() => {
		const uuidRegex =
			/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
		if (inputValue && uuidRegex.test(inputValue)) {
			setDownloadUrl(
				`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/${isAuthenticated ? 'user' : 'public'}/files/download/${inputValue}`
			);
		} else {
			setDownloadUrl("");
		}
	}, [inputValue, isAuthenticated]);

	const handlePaste = () => {
		navigator.clipboard.readText().then((text) => {
			setInputValue(text);
			setPasted(true);
			toast({
				title: t("download.toast.pasted.title"),
				description: t("download.toast.pasted.description"),
			});
			setTimeout(() => setPasted(false), 3000);
		});
	};

	return (
		<div className="flex h-full w-full flex-col items-center justify-center gap-8 p-4">
			<Card className="w-full max-w-md shadow-lg">
				<CardHeader>
					<CardTitle className="text-2xl font-bold text-center">
						{downloadUrl ? t("download.title") : "Paste your file ID"}
					</CardTitle>
					<CardDescription className="text-center truncate px-4">
						{downloadUrl ? t("download.description") : ""}
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="space-y-2">
						<Label htmlFor="uuid-input">{t("download.fileId")}</Label>
						<div className="relative">
							<LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
							<Input
								id="uuid-input"
								value={inputValue}
								className="pl-10 pr-10"
								placeholder="Enter file ID..."
								onChange={(e) => setInputValue(e.target.value)}
							/>
							<Button
								size="icon"
								variant="ghost"
								className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
								onClick={handlePaste}
							>
								{pasted ? (
									<Check className="h-4 w-4 text-success" />
								) : (
									<Clipboard className="h-4 w-4" />
								)}
							</Button>
						</div>
					</div>
					{downloadUrl && (
						<Button asChild className="w-full">
							<a href={downloadUrl} target="_blank" rel="noopener noreferrer">
								<Download className="mr-2 h-4 w-4" />
								{t("download.downloadButton")}
							</a>
						</Button>
					)}
				</CardContent>
				<CardFooter>
					<p className="text-xs text-muted-foreground text-center w-full">
						{inputValue ? t("download.newTab") : t("download.expiration")}
					</p>
				</CardFooter>
			</Card>
			<AdPlaceholder className="max-w-md" />
		</div>
	);
}