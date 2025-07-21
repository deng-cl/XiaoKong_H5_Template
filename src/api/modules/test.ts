import http from '@/utils/http'
import { fetchFunctionBatchGenerator } from '@/utils/http/baseImple'

/** 例子
    export const { queryTestTableList, queryTestTableListTest2 } = fetchFunctionBatchGenerator<T>(http,[
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
