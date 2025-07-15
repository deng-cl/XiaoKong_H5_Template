import axios from 'axios'
import type { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse, AxiosRequestConfig } from 'axios'

class HRequest {
    instance: AxiosInstance
    interceptors: Partial<HRequestInterceptors> | undefined /* Partial: 统一转换可选类型 */

    constructor(config: /* HRequestConfig: 对原来的 axios 中的 AxiosRequestConfig 接口进行扩展*/ HRequestConfig) {
        this.instance =
            axios.create(
                config,
            ) /* 每次 new HRquest 时，都是一个独立的 axios 实例供下面所要封装的请求方法使用 <业务需要可能要创建多个 instance 实例: 如当项目中需要使用多个请求 baseURL 时> */

        /* 实例拦截器 <对当前实例所有方法都会生效>: 调用自定义拦截器 Hooks : 创建 HRequest 实例或使用下面实例封装的方法时可自定义配置拦截器 hooks 来做对应的拦截操作 */
        this.interceptors = config.interceptors /* 获取 config 中拦截器参数 hooks */
        this.instance.interceptors.request.use(
            this.interceptors?.requestInterceptor || ((config) => config),
            this.interceptors?.requestInterceptorCatch || ((error) => Promise.reject(error)),
        )

        this.instance.interceptors.response.use(
            this.interceptors?.responseInterceptor || ((response) => response),
            this.interceptors?.responseInterceptorCatch || ((error) => Promise.reject(error)),
        )
    }

    request<R>(config: HRequestConfig<R>): Promise<R> {
        if (config?.interceptors?.requestInterceptor) {
            /* 局部请求拦截器 */
            config = config.interceptors.requestInterceptor(
                config as InternalAxiosRequestConfig /* 通过类型断言进行类型范围延申，使其符合对应的拦截器类型 */,
            )
        }

        return this.instance
            .request<any, R>(config)
            .then((res) => {
                /* 通过实例中的 instance/axios 实例，来进行对应请求的封装 */
                if (config?.interceptors?.responseInterceptor) {
                    /* 局部响应拦截器 */
                    res = config.interceptors.responseInterceptor(res) /* 将最终的 res 断言成 R 类型 */
                }
                return res
            })
            .catch((err) => {
                if (config?.interceptors?.responseInterceptorCatch) {
                    err = config.interceptors.responseInterceptorCatch(err)
                }
                return err
            })
    }

    get<R>(url: string, config: Omit<HRequestConfig<R>, 'url'> = {}): Promise<R> {
        return this.request<R>({ ...config, url, method: 'GET' })
    }

    post<R>(url: string, config: Omit<HRequestConfig<R>, 'url'> = {}): Promise<R> {
        return this.request<R>({ ...config, url, method: 'POST' })
    }

    delete<R>(url: string, config: Omit<HRequestConfig<R>, 'url'> = {}): Promise<R> {
        return this.request<R>({ ...config, url, method: 'DELETE' })
    }

    patch<R>(url: string, config: Omit<HRequestConfig<R>, 'url'> = {}): Promise<R> {
        return this.request<R>({ ...config, url, method: 'PATCH' })
    }

    put<R>(url: string, config: Omit<HRequestConfig<R>, 'url'> = {}): Promise<R> {
        return this.request<R>({ ...config, url, method: 'PUT' })
    }
}

/** HRequest 实例 config 配置对象类型声明 */
export interface HRequestConfig<T = HInternalAxiosResponseConfig> extends AxiosRequestConfig {
    interceptors?: Partial<HRequestInterceptors<T>>
}

/** 拦截器扩展类型声明 */
export interface HRequestInterceptors<T = HInternalAxiosResponseConfig> {
    /* 定义 HRequestInterceptors 接口: 用于扩展 axios 中的 config 的 AxiosRequestConfig，扩展 axios 拦截器参数 */
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

export * from './utils'
export default HRequest
