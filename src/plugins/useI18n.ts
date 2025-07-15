import type { App } from 'vue'
import { createI18n } from 'vue-i18n'
import { en, zh } from '../../locales/index'
import { storage } from '@/utils/storager'

export type LocalType = 'en' | 'zh'
export const LOCALE_STORAGE_KEY = 'locale'

export const langsConfig = {
    en: { ...en },
    zh: { ...zh },
}

const i18n = createI18n({
    fallbackLocale: 'en',
    locale: storage.get(LOCALE_STORAGE_KEY) ?? 'en',
    legacy: false,
    messages: langsConfig,
})

export const useI18n = (app: App) => {
    app.use(i18n)
}
