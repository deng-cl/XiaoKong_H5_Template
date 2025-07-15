/*
 * @Author: jiaokun jiaokun@tevaupay.com
 * @Date: 2025-07-04 15:28:23
 * @LastEditors: jiaokun jiaokun@tevaupay.com
 * @LastEditTime: 2025-07-04 15:28:28
 * @FilePath: /postcss.config.js
 * @Description: px 自动转换 vw
 */
export default {
    plugins: {
        'postcss-px-to-viewport': {
            viewportWidth: 375, // 设计稿宽度
            unitPrecision: 6,
            viewportUnit: 'vw',
            selectorBlackList: ['ignore', 'van-'], // 忽略 Vant 的 px
            minPixelValue: 1,
            mediaQuery: false,
        },
    },
}
