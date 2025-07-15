import type HRequest from "."
import type { HRequestConfig } from "."

type RequestMethodType = 'GET' | 'POST' | 'DELETE' | 'PATCH' | 'PUT'

interface HFetchList {
    key: string
    url: string
    method: RequestMethodType
}

type HFetchListTuple = [string, RequestMethodType, string]

type FetchGenFunctionType = (
    data?: any,
    config?: Omit<HRequestConfig, 'url' | 'method' | 'data' | 'params'>,
) => Promise<any>


/**
 * 批量生成请求方法工具函数
 * @param http
 * @param fetchList
 * @useExample const { fetchExample1, fetchExample2 } = fetchFunctionBatchGenerator(http, [{ key:'fetchExample1', method: 'GET', url: '...', ... }, { key:'fetchExample2', method: 'GET', url: '...', ... }])
 * @returns FetchGenFunctionType[]
 */
export const fetchFunctionBatchGenerator = (http: HRequest, fetchList: (HFetchList | HFetchListTuple)[]) => {
    const fetchFunctions = {}

    fetchList.forEach((fetchItem) => {
        const [key, url, method] = Array.isArray(fetchItem) ? fetchItem : [fetchItem.key, fetchItem.url, fetchItem.method]
        patchGenFetch(key, url, method)
    })

    return fetchFunctions as Record<string, FetchGenFunctionType>

    function patchGenFetch(key, url, method) {
        fetchFunctions[key] = async (
            data?: any,
            config: Omit<HRequestConfig, 'url' | 'method' | 'data' | 'params'> = {},
        ) => {
            const fetchConfig = { url, method, ...config } as HRequestConfig

            // -- 请求参数处理
            fetchConfig[method == 'GET' ? 'params' : 'data'] = data

            return http.request(fetchConfig)
        }
    }
}
