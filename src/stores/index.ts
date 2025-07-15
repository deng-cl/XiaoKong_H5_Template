import { createPinia } from 'pinia'
import { createPersistedState } from 'pinia-plugin-persistedstate'

export const registerPinia = () => {
    return createPinia().use(
        createPersistedState({
            key: (id) => `__Hpbs-${id}__`, // -- 配置全局持久化缓存 key
        }),
    )
}

export * from './modules/app'
