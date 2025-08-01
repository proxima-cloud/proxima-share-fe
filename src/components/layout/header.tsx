"use client";

import Link from 'next/link';
import { Share2, Languages, Menu } from 'lucide-react';
import { ThemeToggle } from '@/components/feature/theme-toggle';
import { useTranslation } from 'react-i18next';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';


export default function Header() {
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };
  
  const navLinks = (
    <>
      <Link href="/about" className="block px-3 py-2 rounded-lg text-muted-foreground transition-colors hover:text-primary hover:bg-muted/50">
        {t('header.about')}
      </Link>
      <Link href="/terms" className="block px-3 py-2 rounded-lg text-muted-foreground transition-colors hover:text-primary hover:bg-muted/50">
        {t('footer.terms')}
      </Link>
      <Link href="/privacy" className="block px-3 py-2 rounded-lg text-muted-foreground transition-colors hover:text-primary hover:bg-muted/50">
        {t('header.privacy')}
      </Link>
    </>
  );

  const actionButtons = (
     <>
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Languages />
                <span className="sr-only">{t('header.language')}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => changeLanguage('en')}>
                English
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => changeLanguage('es')}>
                Español
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => changeLanguage('fr')}>
                Français
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => changeLanguage('de')}>
                Deutsch
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => changeLanguage('hi')}>
                हिन्दी
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => changeLanguage('pt')}>
                Português
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => changeLanguage('ja')}>
                日本語
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => changeLanguage('zh')}>
                中文 (简体)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => changeLanguage('ru')}>
                Русский
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => changeLanguage('ar')}>
                العربية
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => changeLanguage('it')}>
                Italiano
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => changeLanguage('ko')}>
                한국어
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <ThemeToggle />
     </>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/75 backdrop-blur-sm supports-[backdrop-filter]:bg-background/60">
      <div className="out-wrap flex justify-center">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
                <Share2 className="h-6 w-6 text-primary" />
                <span className="font-bold hidden sm:inline-block">ProximaShare</span>
            </Link>
        </div>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          {navLinks}
        </nav>

        <div className="flex items-center gap-2">
            <div className="hidden md:flex">{actionButtons}</div>

            <div className="md:hidden">
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon">
                            <Menu className="h-6 w-6" />
                            <span className="sr-only">Open menu</span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="right" className="w-[240px]">
                        <div className="flex flex-col gap-4 p-4">
                            <div className="flex flex-col gap-2">
                                {navLinks}
                            </div>
                        </div>
                    </SheetContent>
                </Sheet>
            </div>
        </div>
      </div>
      </div>
    </header>
  );
}
