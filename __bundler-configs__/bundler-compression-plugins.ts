import type { Plugin } from 'vite'
import { compression } from 'vite-plugin-compression2'

/**
 * 主: 打包压缩处理插件获取
 * @param compress
 * @returns
 */
export const viteCompression = (compress: ViteCompress): Plugin[] => {
    const gz = genCompressionBaseOptions('gzip', '.gz')

    const br = genCompressionBaseOptions('brotliCompress', '.br')

    if (compress === 'none') return [] // -- 不压缩

    // -- 压缩处理
    return compressHandler(compress, gz, br)
}

/**
 * 文件压缩处理
 * @param compress
 * @param gzTem
 * @param brTem
 * @returns
 */
function compressHandler(
    compress: ViteCompress,
    gzTem: ICompressionBaseOptions,
    brTem: ICompressionBaseOptions,
): Plugin[] {
    const compressPlugins: Plugin[] = []

    const isNeedClear = compress.includes('-clear')
    if (isNeedClear) {
        gzTem.deleteOriginalAssets = true
        brTem.deleteOriginalAssets = true
    }

    if (compress.includes('gzip')) compressPlugins.push(compression(gzTem)) // -- gz 压缩

    if (compress.includes('brotli')) compressPlugins.push(compression(brTem)) // -- br 压缩

    // -- br + ga 压缩
    if (compress.includes('both')) {
        compressPlugins.push(
            compression(
                isNeedClear ? Object.assign(gzTem, { deleteOriginalAssets: false }) : gzTem, // -- 特殊处理: 当 compress 为 both-clear 时，如果 gzTem.deleteOriginalAssets 为 true 时，会将 brTem 的压缩文件删除掉
            ),
            compression(brTem),
        )
    }

    return compressPlugins
}

/**
 * 生成基本的压缩配置模板
 * @param algorithm
 * @param ext
 * @param threshold
 * @param deleteOriginalAssets
 * @returns
 */
function genCompressionBaseOptions(
    algorithm: CompressionType,
    ext: string,
    threshold: number = 0,
    deleteOriginalAssets: boolean = false,
): ICompressionBaseOptions {
    return {
        algorithm, // 压缩类型: brotliCompress deflate deflateRaw gzip
        threshold, // -- 阈值
        filename: '[path][base]' + ext, // -- 压缩类型
        deleteOriginalAssets, // -- 是否删除源文件
    }
}

interface ICompressionBaseOptions {
    algorithm: CompressionType
    threshold: number
    filename: string
    deleteOriginalAssets: boolean
}
