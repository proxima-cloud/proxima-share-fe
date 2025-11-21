"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Share2, Languages, Menu, User, LogOut } from 'lucide-react';
import Image from 'next/image';
import { ThemeToggle } from '@/components/feature/theme-toggle';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import RegisterDialog from '@/components/auth/RegisterDialog';
import LoginDialog from '@/components/auth/LoginDialog';


export default function Header() {
  const { t, i18n } = useTranslation();
  const { isAuthenticated, user, logout } = useAuth();
  const router = useRouter();
  const [registerDialogOpen, setRegisterDialogOpen] = useState(false);
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const navLinks = (
    <>
      {isAuthenticated ?
        <Link href="/dashboard" className="block px-3 py-2 rounded-lg text-muted-foreground transition-colors hover:text-primary hover:bg-muted/50">
          {t('header.dashboard')}
        </Link> : <></>
      }
      <Link href="/download" className="block px-3 py-2 rounded-lg text-muted-foreground transition-colors hover:text-primary hover:bg-muted/50">
        {t('header.download')}
      </Link>
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

      {/* Authentication buttons */}
      {isAuthenticated ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <User className="h-4 w-4" />
              <span className="sr-only">User menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {/* <div className="px-2 py-1.5 text-sm font-medium"> */}
            <DropdownMenuItem onClick={() => router.push('/profile')}>
              {user?.username}
            </DropdownMenuItem>
            {/* </div> */}
            {/* <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push('/dashboard')}>
                  Dashboard
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push('/profile')}>
                  Profile
                </DropdownMenuItem> */}
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <div className="flex items-center gap-2">
          <Button variant="ghost" onClick={() => setLoginDialogOpen(true)}>
            Login
          </Button>
          <Button onClick={() => setRegisterDialogOpen(true)}>
            Register
          </Button>
        </div>
      )}
    </>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/75 backdrop-blur-sm supports-[backdrop-filter]:bg-background/60">
      <div className="out-wrap flex justify-center">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <Image
                src="/images/logo.png"
                alt="ProximaShare Logo"
                width={40}
                height={40}
                priority
              />
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
      <LoginDialog
        open={loginDialogOpen}
        onOpenChange={setLoginDialogOpen}
        onOpenRegister={() => {
          setLoginDialogOpen(false);
          setRegisterDialogOpen(true);
        }}
      />
      <RegisterDialog
        open={registerDialogOpen}
        onOpenChange={setRegisterDialogOpen}
        onOpenLogin={() => {
          setRegisterDialogOpen(false);
          setLoginDialogOpen(true);
        }}
      />
    </header>
  );
}
