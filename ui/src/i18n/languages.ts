// 语言配置文件
export const languages = [
  {
    code: 'en',
    name: 'English',
    nativeName: 'English'
  },
  {
    code: 'zh',
    name: 'Chinese Simplified',
    nativeName: '中文简体'
  },
  {
    code: 'zh-Hant',
    name: 'Chinese Traditional',
    nativeName: '中文繁體'
  }
];

// 默认语言
export const defaultLanguage = 'en';

// 语言包导入
import en from './locales/en.json';
import zh from './locales/zh.json';
import zhHant from './locales/zh-Hant.json';

// 语言资源映射
export const languageResources = {
  en: { translation: en },
  zh: { translation: zh },
  'zh-Hant': { translation: zhHant }
};