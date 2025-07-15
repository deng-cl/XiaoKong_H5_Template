import { fileURLToPath, URL } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import { __APP_INFO__, wrapperEnv } from './__bundler-configs__/utils'
import { getVitePluginsConfig } from './__bundler-configs__/plugins'

// https://vite.dev/config/
export default defineConfig(async ({ command, mode }) => {
    const {
        VITE_PORT,
        VITE_PUBLIC_PATH,
        VITE_COMPRESSION = 'none',
        VITE_AUTO_IMPORT_COMPONENTS_DIR,
    } = wrapperEnv(loadEnv(mode, process.cwd())) // -- 根据当前工作目录中的 `mode` 加载 .env 文件。设置第三个参数为 '' 来加载所有环境变量，而不管是否有 `VITE_` 前缀

    return {
        // -- common config
        root: process.cwd(),

        base: VITE_PUBLIC_PATH,

        define: {
            __APP_INFO__: JSON.stringify(__APP_INFO__),
        },

        publicDir: './public',

        plugins: getVitePluginsConfig(VITE_COMPRESSION, VITE_AUTO_IMPORT_COMPONENTS_DIR),

        resolve: {
            alias: {
                '@': resolvePathInCurrentFilePosition('./src'),
                '@build': resolvePathInCurrentFilePosition('./__bundler-configs__'),
            },
        },

        assetsInclude: ['**/*.md'],

        // -- server config
        server: {
            host: '0.0.0.0',
            port: VITE_PORT,

            // 本地跨域代理 https://cn.vitejs.dev/config/server-options.html#server-proxy
            proxy: {},

            // 预热文件以提前转换和缓存结果，降低启动期间的初始页面加载时长并防止转换瀑布
            warmup: {
                clientFiles: ['./index.html', './src/{views,components}/*'],
            },
        },

        // -- build config
        build: {
            // https://cn.vitejs.dev/guide/build.html#browser-compatibility
            target: 'es2015',
            sourcemap: false,
            // chunkSizeWarningLimit: 4000,
            rollupOptions: {
                input: {
                    index: resolvePathInCurrentFilePosition('./index.html'),
                },
                // 静态资源分类打包
                output: {
                    chunkFileNames: 'static/js/[name]-[hash].js',
                    entryFileNames: 'static/js/[name]-[hash].js',
                    assetFileNames: 'static/[ext]/[name]-[hash].[ext]',
                },
            },
        },

        // -- 开发依赖构建优化 - 后续再打算配置
        // optimizeDeps: {}
    }
})

function resolvePathInCurrentFilePosition(path: string) {
    return fileURLToPath(new URL(path, import.meta.url))
}

/** 自动导入插件，后续可了解一下怎么实现的
 * unplugin-vue-components
 * unplugin-auto-import
 */
