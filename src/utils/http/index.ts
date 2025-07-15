import { curry } from '../comcom/funs'
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

/**
 * HFetchList: object
 *  - key: string
 *  - method: 'GET' | 'POST' | 'DELETE' | 'PATCH' | 'PUT'
 *  - url: string
 *
 * HFetchListTuple: tuple
 *  - [
 *     - key:string,
 *     - method: 'GET' | 'POST' | 'DELETE' | 'PATCH' | 'PUT',
 *     - url: string
 *  - ]
 */
export const fetchFunctionBatchGeneratorCurry = curry(fetchFunctionBatchGenerator)(http) // -- 通过函数柯里化，使其 fetchFunctionBatchGenerator 固定该 http 实例，使用起来只需传入第二个参数即可
export default http
