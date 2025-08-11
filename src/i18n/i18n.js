import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from '../i18n/locales/en.json';
import es from '../i18n/locales/es.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next) // ← Esto es crucial para React
  .init({
    resources: {
      en: { translation: en },
      es: { translation: es },
    },
    fallbackLng: 'es',
    debug: true,
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
