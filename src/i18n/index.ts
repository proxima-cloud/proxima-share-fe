import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import en from '@/locales/en';
import es from '@/locales/es';
import fr from '@/locales/fr';
import de from '@/locales/de';
import hi from '@/locales/hi';
import pt from '@/locales/pt';
import ja from '@/locales/ja';
import zh from '@/locales/zh';
import ru from '@/locales/ru';
import ar from '@/locales/ar';
import it from '@/locales/it';
import ko from '@/locales/ko';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
    resources: {
      en: { translation: en },
      es: { translation: es },
      fr: { translation: fr },
      de: { translation: de },
      hi: { translation: hi },
      pt: { translation: pt },
      ja: { translation: ja },
      zh: { translation: zh },
      ru: { translation: ru },
      ar: { translation: ar },
      it: { translation: it },
      ko: { translation: ko },
    },
  });

export default i18n;
