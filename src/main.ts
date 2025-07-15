import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { registerDirectives, useI18n } from './plugins'
import { registerPinia } from './stores'
import '@/styles/index.scss'

const app = createApp(App)

// -- 插件配置列表 → 注册插件列表中的所有插件
const plugins = [registerPinia(), router, registerDirectives, useI18n]
plugins.forEach((plugin) => /* 插件注册前处理... */ app.use(plugin))

app.mount('#app')
