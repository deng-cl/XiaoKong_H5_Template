/** HRequest 实例拦截器处理（内部处理可根据项目需求进行修改） */
import type { HInternalAxiosRequestConfig, HInternalAxiosResponseConfig } from './baseImple'

/** 请求拦截器 */
export function requestInterceptorHandle(config: HInternalAxiosRequestConfig): HInternalAxiosRequestConfig {
    return config
}

/** 响应拦截器 */
export function responseInterceptorHandle(response: HInternalAxiosResponseConfig): HInternalAxiosResponseConfig {
    return response
}
