import HRequest from '.'
import type { HRequestConfig } from '.'

// -- 请求方法类型
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'

// -- 请求 config 配置类型
type HttpConfig = Omit<HRequestConfig, 'url' | 'method' | 'data' | 'params'>

// -- 生成的请求函数 → 通过泛型 R 来提供请求响应结果的类型声明
type FetchGenFunction<R = any> = (data?: any, config?: HttpConfig) => Promise<R>
type GoodGenerateFetchFunctions<T> = {
    [K in keyof T]: FetchGenFunction<T[K]>
}

// -- 传入的参数列表类型 → 通过泛型 K 来限制传入的 key 类型
interface FetchList<K> {
    key: K
    url: string
    method: HttpMethod
}
type FetchListTuple<K> = [key: K, url: string, HttpMethod]
type FetchListInput<K> = (FetchList<K> | FetchListTuple<K>)[]

/**
 * 通过配置的形式 - 快速批量生成请求函数
 * @genericity 泛型 T extends Record<string, any> → 传入可用于限制 fetchList 配置,与提供更好的提示
 * @param http 传入 HRequest 请求实例
 * @param fetchList 请求函数生成配置列表
 * @returns GoodGenerateFetchFunctions<T> → 返回所生成的请求函数对象
 */
export const fetchFunctionBatchGenerator = <T extends Record<string, any> = Record<string, any>>(http: HRequest, fetchList: FetchListInput<keyof T>): GoodGenerateFetchFunctions<T> => {
    const fetchFunctions = {}

    fetchList.forEach((fetchItem) => {
        const [key, url, method] = Array.isArray(fetchItem) ? fetchItem : [fetchItem.key, fetchItem.url, fetchItem.method]
        patchGenFetch(key, url, method)
    })

    return fetchFunctions as GoodGenerateFetchFunctions<T>

    // -- 生成请求函数方法
    function patchGenFetch(key, url, method) {
        fetchFunctions[key] = async (data?: any, config: HttpConfig = {}) => {
            const fetchConfig = { url, method, ...config } as HRequestConfig

            fetchConfig[method == 'GET' ? 'params' : 'data'] = data

            return http.request(fetchConfig)
        }
    }
}

/** Using Example: fetchFunctionBatchGenerator
 *  - example 1
        const http = new HRequest({})
        const { getUsername, getUserAge } = fetchFunctionBatchGenerator<{ getUsername: string; getUserAge: number }>(http, [
            { key: 'getUsername', url: '/user/name', method: 'GET' },
            ['getUserAge', '/user/age', 'GET']
        ])
  
 *  - example 2 → curried
        const http = new HRequest({})
        export const fetchFunctionBatchGeneratorCurry = curry(fetchFunctionBatchGenerator)(http)
        const { getUsername, getUserAge } = fetchFunctionBatchGeneratorCurry<{ getUsername: string; getUserAge: number }>([
            { key: 'getUsername', url: '/user/name', method: 'GET' },
            ['getUserAge', '/user/age', 'GET']
        ])
 */
