import type { App, Directive, DirectiveBinding } from 'vue'

// -- 指令列表（可以将指令实现相关的，单独抽取到一个新目录中进行管理，这里只做一个示例）
const directives: [key: string, Directive][] = [
    [
        'alert',
        {
            // -- 双击 alert 弹窗展示 value 值指令（只做示例使用）
            mounted(el: HTMLElement, binding: DirectiveBinding<string | Array<string>>) {
                const { value } = binding
                if (value) {
                    const arg = binding.arg ?? 'dblclick'
                    el.addEventListener(arg, () => {
                        alert(value)
                    })
                } else {
                    throw new Error('[Directive: alert]: need value! Like v-alert="modelValue"')
                }
            },
        } as Directive,
    ],
]

// -- 注册所有指令插件
export const registerDirectives = (app: App) => {
    directives.forEach(([key, directive]) => {
        app.directive(key, directive)
    })
}

// -- 🔺Tip:为了在使用自定义指令可以有更好的提示，添加了新的自定义指令，请在此添加对应的类型声明，移除为避免混淆也需要在此移除掉类型声明（该 ICustomDirectives 类型声明，将会在 types/shims-vue.d.ts 中引入并声明为 Vue 自定义指令）
export interface ICustomDirectives {
    vAlert: Directive<HTMLElement, string> // -- Test: alert 弹窗指令（默认双击弹出对应内容的 alert 弹窗）→ Tip: 该指令仅为一个示例指令
}
