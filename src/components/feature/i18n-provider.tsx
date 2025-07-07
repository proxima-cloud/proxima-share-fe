"use client";

import { I18nextProvider, useTranslation } from "react-i18next";
import i18n from "@/i18n";
import { ReactNode, useEffect } from "react";

const UpdateHtmlLang = () => {
  const { i18n } = useTranslation();
  useEffect(() => {
    document.documentElement.lang = i18n.language;
    // Also update the dir attribute if using RTL languages
    document.documentElement.dir = i18n.dir(i18n.language);
  }, [i18n.language, i18n]);
  return null;
};

export default function I18nProvider({ children }: { children: ReactNode }) {
  return (
    <I18nextProvider i18n={i18n}>
        <UpdateHtmlLang />
        {children}
    </I18nextProvider>
  );
}
