import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'
import { codeInspectorPlugin } from 'code-inspector-plugin'
import { viteBundlerInfoPlugin } from './bundler-info-plugin'
import removeConsole from 'vite-plugin-remove-console'
import { viteCompression } from './bundler-compression-plugins'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import { VantResolver } from '@vant/auto-import-resolver'

export const getVitePluginsConfig = (VITE_COMPRESSION: ViteCompress, VITE_AUTO_IMPORT_COMPONENTS_DIR: string) => {
    /** ... */
    return [
        vue(),
        vueJsx({
            // transformOn: true,
            // mergeProps: true,
        }),
        vueDevTools(),

        /**
         * 在页面上按住组合键时，鼠标在页面移动即会在 DOM 上出现遮罩层并显示相关信息，点击一下将自动打开 IDE 并将光标定位到元素对应的代码位置
         * Mac 默认组合键 Option + Shift
         * Windows 默认组合键 Alt + Shift
         * 更多用法看 https://inspector.fe-dev.cn/guide/start.html
         */
        codeInspectorPlugin({
            bundler: 'vite',
            hideConsole: true, // -- 隐藏在浏览器控制台打印的关于 code-inspector-plugin 组合键的提示
        }),

        /**
         * 打印 vite 构建信息
         */
        viteBundlerInfoPlugin(),

        /**
         * 线上环境删除 console
         */
        removeConsole(),

        /**
         * compress 代码压缩: https://www.npmjs.com/package/vite-plugin-compression2
         */
        viteCompression(VITE_COMPRESSION),

        /**
         * 配置包不进行打包，采用 cdn 方式引入（后续想要使用 cdn 方式，再进行配置）: vite-plugin-cdn-import
         */

        /**
         * Element Plus 自动导入
         */
        AutoImport({
            resolvers: [ElementPlusResolver()],
            imports: ['vue', '@vueuse/core'],
            dts: 'types/auto-imports.d.ts',
        }),
        Components({
            resolvers: [VantResolver()],
            dirs: [VITE_AUTO_IMPORT_COMPONENTS_DIR],
            dts: 'types/components.d.ts',
        }),
    ]
}
