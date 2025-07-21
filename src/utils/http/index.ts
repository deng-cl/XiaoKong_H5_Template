import HRequest, { fetchFunctionBatchGenerator } from './baseImple'
import { requestInterceptorHandle, responseInterceptorHandle } from './interceptors'

const http = new HRequest({
    baseURL: import.meta.env.VITE_APP_API,
    timeout: 10000,
    interceptors: {
        // -- 实例请求拦截
        requestInterceptor(config) {
            return requestInterceptorHandle(config)
        },
        // -- 实例响应拦截
        responseInterceptor(response) {
            return responseInterceptorHandle(response)
        },
    },
})

export default http
