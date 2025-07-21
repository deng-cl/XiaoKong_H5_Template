import axios from 'axios'
import type { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse, AxiosRequestConfig, Method } from 'axios'

/** HRequest 实例 config 配置对象类型声明 */
export interface HRequestConfig<T = HInternalAxiosResponseConfig> extends AxiosRequestConfig {
    interceptors?: Partial<HRequestInterceptors<T>>
}

/** 拦截器扩展类型声明 */
export interface HRequestInterceptors<T = HInternalAxiosResponseConfig> {
    requestInterceptor: (config: HInternalAxiosRequestConfig) => HInternalAxiosRequestConfig
    requestInterceptorCatch: (error: any) => any
    responseInterceptor: (config: T) => T
    responseInterceptorCatch: (error: any) => any
}

/** 请求拦截器类型扩展 */
export interface HInternalAxiosRequestConfig extends InternalAxiosRequestConfig {
    [key: string]: any
}
/** 响应拦截器类型扩展 */
export interface HInternalAxiosResponseConfig extends AxiosResponse {
    [key: string]: any
}

// --------------------------------------------- HRequest 实现
class HRequest {
    instance: AxiosInstance
    interceptors: Partial<HRequestInterceptors> | undefined

    constructor(config: HRequestConfig) {
        // -- 创建 axios 实例
        this.instance = axios.create(config)

        // -- 全局拦截器解构
        const { requestInterceptor, requestInterceptorCatch, responseInterceptor, responseInterceptorCatch } = (this.interceptors = config.interceptors) ?? {}

        // -- 全局请求拦截器
        this.instance.interceptors.request.use(requestInterceptor || ((config) => config), requestInterceptorCatch || ((error) => Promise.reject(error)))

        // -- 全局响应拦截器
        this.instance.interceptors.response.use(responseInterceptor || ((response) => response), responseInterceptorCatch || ((error) => Promise.reject(error)))
    }

    // -- 公共调用方法
    async request<R>(config: HRequestConfig<R>): Promise<R> {
        // -- 局部拦截器解构
        const { requestInterceptor, responseInterceptor, responseInterceptorCatch } = config.interceptors ?? {}

        // -- 局部请求拦截器
        if (requestInterceptor) config = requestInterceptor(config as InternalAxiosRequestConfig)

        // -- 发起请求
        try {
            const result = await this.instance.request<any, R>(config)
            return responseInterceptor ? responseInterceptor(result) : result // -- 局部响应拦截器
        } catch (error: any) {
            return responseInterceptorCatch ? responseInterceptorCatch(error) : error // -- 局部响应拦截器
        }
    }

    // -- 动态生成 HTTP 方法(闭包)
    private createHttpMethod(method: Method) {
        return <R>(url: string, config: Omit<HRequestConfig<R>, 'url'> = {}) => {
            return this.request<R>({ ...config, url, method })
        }
    }

    // -- 快捷请求方法
    public get = this.createHttpMethod('GET')
    public post = this.createHttpMethod('POST')
    public delete = this.createHttpMethod('DELETE')
    public patch = this.createHttpMethod('PATCH')
    public put = this.createHttpMethod('PUT')
}

export * from './utils'
export default HRequest
