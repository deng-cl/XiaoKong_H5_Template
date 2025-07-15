import http, { fetchFunctionBatchGeneratorCurry } from '@/utils/http'

/** 例子
    export const { queryTestTableList, queryTestTableListTest2 } = fetchFunctionBatchGeneratorCurry([
        {
            key: 'queryTestTableList',
            method: 'POST',
            url: '/table/test',
        },
        ['queryTestTableListTest2', 'POST', '/table/test'],
    ])

    const queryTestTableList = () => {
        return http.get('url')
    }
 */
