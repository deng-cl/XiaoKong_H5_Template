import dayjs from 'dayjs'
import { name, version, dependencies, devDependencies } from '../package.json'
import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'
import { readdir, stat } from 'fs/promises'

/** 处理环境变量: 环境变量归一化处理与默认值 */
export const wrapperEnv = (rawEnv: Record<string, any>): Partial<ImportMetaEnv> => {
    /** 环境变量默认值 */
    const wrapEnv: Partial<ImportMetaEnv> = {
        VITE_PORT: 5173,
        VITE_PUBLIC_PATH: '',
        VITE_APP_API: '',
        VITE_COMPRESSION: 'none',
        VITE_AUTO_IMPORT_COMPONENTS_DIR: 'none',
    }

    for (const eName of Object.keys(rawEnv)) {
        let eVal = rawEnv[eName].replace(/\\n/g, '\n')

        eVal = eVal === 'true' ? true : eVal === 'false' ? false : eVal // -- boolean

        if (eName === 'VITE_PORT') eVal = Number(eVal)

        wrapEnv[eName] = eVal

        // -- 将所有环境变量赋值一份到 process.env 上，使其再 node 的运行环境上也可以获取到同样的环境变量
        process.env[eName] = eVal
    }

    return wrapEnv
}

/** 平台的名称、版本、运行所需的`node`和`pnpm`版本、依赖、最后构建时间的类型提示 */
export const __APP_INFO__ = {
    pkg: { name, version, dependencies, devDependencies },
    lastBuildTime: dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss'),
}

/** 获取指定文件夹中所有文件的总大小 */
const fileListTotal: number[] = []
export const getPackageSize = async (
    options: Partial<{ folder: string; cb: (size: string) => void; format: boolean }> = {},
) => {
    const { folder = 'dist', cb = () => {}, format = true } = options

    try {
        const files = await readdir(folder)

        let count = 0 // -- 计数:判断当前目录是否检索完成
        const chuckEndCb = () => {
            if (++count === files.length) {
                const size = fileListTotal.reduce((a, b) => a + b, 0)
                cb(format ? formatBytes(size) : String(size))
            }
        }

        files.forEach((item) => {
            stat(`${folder}/${item}`).then((stats) => {
                if (stats.isFile()) {
                    fileListTotal.push(stats.size)
                    chuckEndCb()
                }

                if (stats.isDirectory())
                    getPackageSize({
                        folder: `${folder}/${item}`,
                        cb: chuckEndCb,
                    })
            })
        })
    } catch (error) {
        console.log('Error for getPackageSize:', error)
    }
}

/**
 * deepSeek
 * @param bytes
 * @param locale
 * @param decimals
 * @returns
 */
function formatBytes(bytes: number, locale = 'en', decimals = 2) {
    if (bytes === 0) return '0 Bytes'

    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

    const i = Math.floor(Math.log(bytes) / Math.log(k))
    const value = bytes / Math.pow(k, i)

    return (
        new Intl.NumberFormat(locale, {
            maximumFractionDigits: dm,
            minimumFractionDigits: dm,
        }).format(value) +
        ' ' +
        sizes[i]
    )
}
