import { type ICustomDirectives, type IGlobalComponents } from '@/plugins'

declare module 'vue' {
    /**
     * 全局组件类型声明（IGlobalComponents）: 自定义全局组件获得 Volar 提示（自定义的全局组件需要在这里声明下才能获得 Volar 类型提示哦）-
     */
    export interface GlobalComponents extends IGlobalComponents {}

    /**
     * 自定义指令 ICustomDirectives 类型声明
     */
    export interface ComponentCustomProperties extends ICustomDirectives {}
}

/**
 * 后缀 .vue 文件类型声明
 */
declare module '*.vue' {
    import type { DefineComponent } from 'vue'
    const component: DefineComponent<{}, {}, any>
    export default component
}
