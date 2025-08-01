"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from 'react-i18next';

export default function PrivacyPage() {
  const { t } = useTranslation();
  const [lastUpdated, setLastUpdated] = useState<string>('');

  useEffect(() => {
    document.title = `${t('privacy.title')} | ProximaShare`;
    
    // This code runs only on the client, after the component mounts.
    // This avoids a server-client mismatch (hydration error).
    setLastUpdated(new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }));
  }, [t]);

  return (
    <div className="container mx-auto max-w-4xl px-4 py-12 md:px-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">{t('privacy.title')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 text-muted-foreground">
          <p>
            {t('privacy.lastUpdated', { date: lastUpdated || '...' })}
          </p>
          <p>
            {t('privacy.intro')}
          </p>
          
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold text-foreground">{t('privacy.info.title')}</h2>
            <p>
              {t('privacy.info.description')}
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-semibold text-foreground">{t('privacy.use.title')}</h2>
            <p>
              {t('privacy.use.description')}
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-semibold text-foreground">{t('privacy.sharing.title')}</h2>
            <p>
              {t('privacy.sharing.description')}
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-semibold text-foreground">{t('privacy.retention.title')}</h2>
            <p>
              {t('privacy.retention.description')}
            </p>
          </div>

           <div className="space-y-2">
            <h2 className="text-2xl font-semibold text-foreground">{t('privacy.contact.title')}</h2>
            <p>
              {t('privacy.contact.description')}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
