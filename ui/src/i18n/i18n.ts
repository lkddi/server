// i18n配置文件
import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { languageResources, defaultLanguage } from './languages';

// 配置i18next
i18next
  .use(LanguageDetector) // 用于检测浏览器语言
  .use(initReactI18next) // 将i18next与React连接
  .init({
    resources: languageResources,
    fallbackLng: defaultLanguage,
    debug: process.env.NODE_ENV === 'development',

    interpolation: {
      escapeValue: false // React会自动转义
    },

    detection: {
      order: ['querystring', 'cookie', 'localStorage', 'sessionStorage', 'navigator'],
      caches: ['localStorage', 'sessionStorage'],
      lookupQuerystring: 'lng',
      lookupCookie: 'i18next',
      lookupLocalStorage: 'i18nextLng',
      lookupSessionStorage: 'i18nextLng'
    }
  });

export default i18next;