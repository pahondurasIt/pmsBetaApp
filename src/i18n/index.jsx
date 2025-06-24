import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { I18nextProvider } from 'react-i18next';
import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import AppBar from '@mui/material/AppBar';

i18n
  .use(LanguageDetector)
  .init({
    resources: {
      en: { translation: require('../i18n/locales/en.json') },
      es: { translation: require('../i18n/locales/es.json') },
    },
    fallbackLng: 'es', // Idioma por defecto
    debug: true, // Activa logs para depuración (opcional)
    interpolation: {
      escapeValue: false, // React ya escapa por defecto
    },
  });

ReactDOM.render(
  <I18nextProvider i18n={i18n}>
    <AppBar />
  </I18nextProvider>,
  document.getElementById('root')
);