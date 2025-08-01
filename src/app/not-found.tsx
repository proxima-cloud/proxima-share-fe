"use client";

import { Button } from "@/components/ui/button";
import { TriangleAlert } from "lucide-react";
import Link from "next/link";
import { useTranslation } from "react-i18next";

export default function NotFound() {
  const { t } = useTranslation();

  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
      <TriangleAlert className="h-24 w-24 text-destructive" />
      <h1 className="text-4xl font-bold">{t("notFound.title")}</h1>
      <p className="max-w-md text-muted-foreground">
        {t("notFound.description")}
      </p>
      <Button asChild>
        <Link href="/">{t("notFound.goHome")}</Link>
      </Button>
    </div>
  );
}
