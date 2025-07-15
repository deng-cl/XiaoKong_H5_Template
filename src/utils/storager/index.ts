import { HStorage } from './localeStoreageImp'

export const storage = new HStorage({
    namespace: 'Hpbs-',
    encrypt: false,
})
