import boxen, { type Options as BoxenOptions } from 'boxen'
import type { Dayjs } from 'dayjs'
import dayjs from 'dayjs'
import gradient from 'gradient-string'
import type { Plugin } from 'vite'
import { getPackageSize } from './utils'

export const viteBundlerInfoPlugin = (): Plugin => {
    let config: { command: string }
    let startTime: number
    let endTime: number
    let outDir: string

    return {
        name: 'bundler-info',
        configResolved(resolvedConfig) {
            config = resolvedConfig
            outDir = resolvedConfig.build?.outDir ?? 'dist'
        },
        buildStart() {
            console.log(wrapTextBoxenAndGradient(`您好! 欢迎使用 HPlainBackStageMain 项目模板`))
            if (config.command === 'build') {
                startTime = Date.now()
            }
        },
        closeBundle() {
            if (config.command === 'build') {
                endTime = Date.now()
                getPackageSize({
                    cb(size) {
                        console.log(
                            wrapTextBoxenAndGradient(
                                `🎉 恭喜打包完成（总用时${dayjs(endTime - startTime).format('mm分ss秒')}，打包后的大小为 ${size}）`,
                            ),
                        )
                    },
                })
            }
        },
    }
}

/** 日志打印文字样式包装（boxen & gradient-style） */
function wrapTextBoxenAndGradient(text: string): string {
    const textWrapGradient = gradient(['cyan', 'magenta']).multiline(text)

    const textWrapped = boxen(textWrapGradient, {
        padding: 0.5,
        borderColor: 'cyan', // --'black' 'red' 'green' 'yellow' 'blue' 'magenta' 'cyan' 'white' 'gray'
        borderStyle: 'round',
        textAlignment: 'center',
    } as BoxenOptions)

    return textWrapped
}
