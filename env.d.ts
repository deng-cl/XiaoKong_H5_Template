/// <reference types="vite/client" />

/** 环境变量类型声明 */
interface ImportMetaEnv extends ViteEnv {
    readonly NODE_ENV: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}
