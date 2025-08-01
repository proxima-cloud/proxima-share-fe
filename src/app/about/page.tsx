"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Share2, Zap, Shield } from 'lucide-react';
// import type { Metadata } from 'next';
// import Image from 'next/image';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';

export default function AboutPage() {
  const { t } = useTranslation();

  useEffect(() => {
    document.title = `${t('about.title')} | ProximaShare`;
  }, [t]);
  
  return (
    <div className="container mx-auto max-w-5xl px-4 py-12 text-center md:px-6">
      <div className="space-y-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">{t('about.title')}</h1>
        <p className="max-w-2xl mx-auto text-lg text-muted-foreground">
          {t('about.description')}
        </p>
      </div>
      
      <div className="mt-16 grid gap-8 md:grid-cols-3">
        <Card className="text-center">
          <CardHeader>
            <Share2 className="mx-auto h-12 w-12 text-primary" />
            <CardTitle className="mt-4">{t('about.feature1.title')}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{t('about.feature1.description')}</p>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardHeader>
            <Zap className="mx-auto h-12 w-12 text-primary" />
            <CardTitle className="mt-4">{t('about.feature2.title')}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{t('about.feature2.description')}</p>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardHeader>
            <Shield className="mx-auto h-12 w-12 text-primary" />
            <CardTitle className="mt-4">{t('about.feature3.title')}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{t('about.feature3.description')}</p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-20">
        <h2 className="text-3xl font-bold text-center">{t('about.team.title')}</h2>
        <p className="text-center text-muted-foreground mt-2 mb-8">{t('about.team.description')}</p>
        <div className="flex justify-center gap-8 flex-wrap">
            <div className="flex flex-col items-center space-y-2">
                <Avatar className="h-24 w-24">
                    <AvatarImage src="https://placehold.co/100x100.png" alt="Team member" data-ai-hint="person" />
                    <AvatarFallback>DV</AvatarFallback>
                </Avatar>
                <h3 className="font-semibold">Girish Sakore</h3>
                <p className="text-sm text-muted-foreground">Co-Founder & Lead Engineer(Proxima Cloud)</p>
            </div>
            <div className="flex flex-col items-center space-y-2">
                <Avatar className="h-24 w-24">
                    <AvatarImage src="https://placehold.co/100x100.png" alt="Team member" data-ai-hint="person" />
                    <AvatarFallback>AI</AvatarFallback>
                </Avatar>
                <h3 className="font-semibold">Chandrakant Nagpure</h3>
                <p className="text-sm text-muted-foreground">Co-Founder & Lead Design(Proxima Cloud)</p>
            </div>
             {/* <div className="flex flex-col items-center space-y-2">
                <Avatar className="h-24 w-24">
                    <AvatarImage src="https://placehold.co/100x100.png" alt="Team member" data-ai-hint="person" />
                    <AvatarFallback>SD</AvatarFallback>
                </Avatar>
                <h3 className="font-semibold">{t('about.team.member3.name')}</h3>
                <p className="text-sm text-muted-foreground">{t('about.team.member3.role')}</p>
            </div> */}
        </div>
      </div>
    </div>
  );
}
