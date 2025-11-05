import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { ThemeProvider } from '@/components/feature/theme-provider';
import I18nProvider from '@/components/feature/i18n-provider';
import { AuthProvider } from '@/contexts/AuthContext';
import { Inter } from 'next/font/google';
import { cn } from '@/lib/utils';

const fontBody = Inter({ 
  subsets: ['latin'],
  variable: '--font-body'
});


export const metadata: Metadata = {
  title: {
    default: 'ProximaShare | Simple & Secure File Sharing',
    template: `%s | ProximaShare`,
  },
  description: 'The easiest way to share files securely. Drag, drop, and get a shareable link in seconds. Fast, modern, and privacy-focused file sharing.',
  keywords: ['file sharing', 'secure file transfer', 'large file sharing', 'free file sharing', 'ProximaShare'],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <body className={cn(
        "font-body antialiased h-full flex flex-col bg-background",
        fontBody.variable
        )}>
        <div className="fixed top-0 left-0 w-full h-full bg-gradient-to-br from-proxima-sky/30 to-proxima-salmon/30 dark:from-proxima-sky/20 dark:to-proxima-salmon/20 -z-10" />
        <I18nProvider>
          <AuthProvider>
            <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
            >
              <Header />
              <main className="flex-1">
                {children}
              </main>
              <Footer />
              <Toaster />
            </ThemeProvider>
          </AuthProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
