import i18next from 'i18next';
// import enCommon from './locales/en/common.json';
// import deCommon from './locales/de/common.json';
import fs from 'fs'
import path from 'path';


const enCommonPath = path.resolve('./src/locales/en/common.json');
const deCommonPath = path.resolve('./src/locales/de/common.json');

// Read and parse JSON files
const enCommon = JSON.parse(fs.readFileSync(enCommonPath, 'utf-8'));
const deCommon = JSON.parse(fs.readFileSync(deCommonPath, 'utf-8'));

i18next.init({
    lng: 'en', // if you're using a language detector, do not define the lng option
    debug: false,
    resources: {
        en: {
            translation: enCommon
        },
        de: {
            translation: deCommon
        }
    }
});

const t = i18next.t;

export { i18next, t };