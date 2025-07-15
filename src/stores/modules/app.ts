import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { useI18n } from 'vue-i18n'
import { LOCALE_STORAGE_KEY, type LocalType } from '@/plugins'
import { storage } from '@/utils/storager'

export const useAppStore = defineStore(
    'App',
    () => {
        // -- 国际化语言
        let { locale: cLocale } = useI18n()
        const locale: ComputedRef<LocalType> = computed(() => cLocale.value as LocalType)
        const upLocale = (nLocale: LocalType) => {
            cLocale.value = nLocale
            storage.set(LOCALE_STORAGE_KEY, nLocale)
        }

        return { locale, upLocale }
    },
    {
        // -- 持久化配置: https://prazdevs.github.io/pinia-plugin-persistedstate/zh/
        persist: {},
    },
)
