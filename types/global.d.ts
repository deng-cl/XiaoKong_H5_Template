import { type VNode } from 'vue'

declare global {
    /**
     * 全局自定义环境变量的类型声明
     */
    interface ViteEnv {
        readonly VITE_PORT: any
        readonly VITE_PUBLIC_PATH: any
        readonly VITE_APP_API: any
        readonly VITE_COMPRESSION: ViteCompress
        readonly VITE_AUTO_IMPORT_COMPONENTS_DIR: string
    }

    /**
     * 平台的名称、版本、依赖、最后构建时间的类型提示
     */
    const __APP_INFO__: {
        pkg: {
            name: string
            version: string
            // engines: {
            //     node: string
            //     pnpm: string
            // }
            dependencies: Recordable<string>
            devDependencies: Recordable<string>
        }
        lastBuildTime: string
    }

    /**
     * 压缩类型
     */
    type CompressionType = 'brotliCompress' | 'deflate' | 'deflateRaw' | 'gzip'
    type ViteCompress =
        | 'none'
        | 'brotli'
        | 'gzip'
        | 'both'
        | 'brotli-clear'
        | 'gzip-clear'
        | 'both-clear'

    namespace JSX {
        interface Element extends VNode {}
        interface ElementClass {
            $props: {}
        }
        interface IntrinsicElements {
            [elem: string]: any
        }
    }
}

export {} // -- 使其文件可以让 TS 识别为一个模块，可以正常识别该文件
