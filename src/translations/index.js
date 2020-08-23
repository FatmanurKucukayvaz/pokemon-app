import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { common } from './locales';

let language = localStorage.getItem('language') && localStorage.getItem('language') != 'undefined' ? localStorage.getItem('language') : 'en';

const options = {
    interpolation: {
        escapeValue: false
    },
    debug: true,
    resources: {
        tr: {
            common: common.tr,
        },
        en: {
            common: common.en,
        },
    },
    lng: language,
    fallbackLng: language,
    ns: ['common'],
    defaultNS: 'common',
    react: {
        wait: false,
        bindI18n: 'languageChanged loaded',
        bindStore: 'added removed',
        nsMode: 'default'
    },
};

i18n
    .use(initReactI18next)
    .init(options)

export default i18n;