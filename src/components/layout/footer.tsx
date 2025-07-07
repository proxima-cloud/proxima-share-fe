"use client";

import Link from 'next/link';
import { useTranslation } from 'react-i18next';

export default function Footer() {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-background/75 backdrop-blur-sm supports-[backdrop-filter]:bg-background/60">
      <div className="container flex flex-col items-center justify-between gap-4 px-4 py-8 md:h-24 md:flex-row md:px-6">
        <p className="text-center text-sm text-muted-foreground md:text-left">
          © {currentYear} ProximaShare. {t('footer.rights')}
        </p>
        <nav className="flex items-center gap-6">
          <Link href="/about" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
            {t('footer.about')}
          </Link>
           <Link href="/terms" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
            {t('footer.terms')}
          </Link>
          <Link href="/privacy" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
            {t('footer.privacy')}
          </Link>
        </nav>
      </div>
    </footer>
  );
}
