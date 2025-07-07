"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from 'react-i18next';

export default function TermsPage() {
  const { t } = useTranslation();
  const [lastUpdated, setLastUpdated] = useState<string>('');

  useEffect(() => {
    document.title = `${t('terms.title')} | ProximaShare`;
    
    // This code runs only on the client, after the component mounts.
    // This avoids a server-client mismatch (hydration error).
    setLastUpdated(new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }));
  }, [t]);

  return (
    <div className="container mx-auto max-w-4xl px-4 py-12 md:px-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">{t('terms.title')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 text-muted-foreground">
          <p>
            {t('terms.lastUpdated', { date: lastUpdated || '...' })}
          </p>
          
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold text-foreground">{t('terms.intro.title')}</h2>
            <p>{t('terms.intro.description')}</p>
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-semibold text-foreground">{t('terms.use.title')}</h2>
            <p>{t('terms.use.description')}</p>
          </div>
          
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold text-foreground">{t('terms.user.title')}</h2>
            <p>{t('terms.user.description')}</p>
          </div>
          
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold text-foreground">{t('terms.termination.title')}</h2>
            <p>{t('terms.termination.description')}</p>
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-semibold text-foreground">{t('terms.disclaimer.title')}</h2>
            <p>{t('terms.disclaimer.description')}</p>
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-semibold text-foreground">{t('terms.contact.title')}</h2>
            <p>{t('terms.contact.description')}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
