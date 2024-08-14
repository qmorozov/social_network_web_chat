import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import tr_en from './en.json';

export const resources = {
  en: {
    translation: tr_en
  }
} as const;

i18n.use(initReactI18next).init({
  lng: 'en',
  interpolation: {
    escapeValue: false
  },
  resources
});
