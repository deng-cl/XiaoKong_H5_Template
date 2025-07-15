import type { CSSProperties } from 'vue'
import { cloneObjectPropertiesByKeys } from './funs'

// -- 需要转换的
export type WithUnitType = string | number | WithUnitType[]
// type _TargetType = Record<string, WithUnitType | (WithUnitType)[]>

// -- 批量 px to vw 转换
export function batchPxToVw(target: Record<string, any>, keys?: string[]) {
    if (keys) target = cloneObjectPropertiesByKeys(target, keys)

    const result: any = {}

    for (const key in target) {
        const v = target[key]
        if (Array.isArray(v)) result[key] = processArrayValue(v)
        else result[key] = processBaseValue(v)
    }

    function processArrayValue(value: WithUnitType[]) {
        return value.map((item) => pxToVw(item))
    }

    function processBaseValue(value: WithUnitType) {
        return pxToVw(value)
    }

    return result
}

/**
 * 批量 px to vw 转换，并映射成 CSS 属性
 * @param target
 * @param keys
 * @param mapKeys
 * @returns
 * Example-1: batchPxToVw_autoMappingCSSKeys(props, ["height", "borderRadius", "padding"], true);
 * Example-2: batchPxToVw_autoMappingCSSKeys(props, ["_height", "_width", "spacing"], ["height", "width", "padding"]);
 * Example-3:
        batchPxToVw_autoMappingCSSKeys(
            props,
            ["height", "borderRadius", "padding"],
            [
                "height", "borderRadius",
                [ "padding", (v) => {
                        return v?.join(" ");
                    },
                ],
            ]
        );
 *
 */
export function batchPxToVw_autoMappingCSSKeys(
    target: Record<string, any>,
    keys: string[],
    mapKeys: (keyof CSSProperties | [keyof CSSProperties, (value: any) => string])[] | true,
) {
    const mapKeysIsSameKey = mapKeys === true
    if (!mapKeysIsSameKey && keys.length !== mapKeys.length)
        return console.error('batchPxToVw_autoMappingCSSKeys: keys与mapKey长度不一致，映射失败！')
    const toVwRes = batchPxToVw(target, keys)
    const mapped: any = {}

    // -- 相同 keys → 直接返回
    if (mapKeysIsSameKey) return toVwRes

    // -- 非相同 keys 映射处理
    mapKeys.forEach((mapKey, index) => {
        // -- 是否为数组类型（[mapKey, decorator]）: 可以通过传入的 decorator 对传入的 key 进行自定义的修饰
        if (Array.isArray(mapKey)) {
            const [key, decorator] = mapKey
            const v = decorator(toVwRes[keys[index]])
            mapped[key] = v
        } else mapped[mapKey] = toVwRes[keys[index]]
    })
    return mapped
}

/**
 * 将 px 转换为 vw（智能处理已有单位的值）
 * @param {WithUnitType} value - 设计稿中的像素值或带单位的字符串（如 "100px", "10vw", "50%"）
 * @param {number} [designWidth=1920] - 设计稿宽度（默认 375px）
 * @returns {string} - 返回转换后的 vw 单位或原单位字符串
 */
export function pxToVw(value: WithUnitType, designWidth = 375) {
    // 如果输入已经是字符串且包含单位，则直接返回
    if (typeof value === 'string') {
        const unitRegex = /^(auto|0)$|^[+-]?[\d.]+(px|vw|vh|%|rem|em|ex|ch|vmin|vmax)$/i
        if (unitRegex.test(value.trim())) {
            return value // 保留原单位
        }

        // 如果是不带单位的纯数字字符串，尝试转换为数值
        const numericValue = parseFloat(value)
        if (!isNaN(numericValue)) {
            value = numericValue // 继续后续 px 转换
        } else {
            return value // 无法识别的字符串原样返回
        }
    }

    // 处理数值类型的 px 转换
    if (typeof value === 'number') {
        if (typeof window === 'undefined') {
            console.warn('pxToVw: 仅支持浏览器环境')
            return `${value}px`
        }
        const vwValue = (value / designWidth) * 100
        return `${vwValue.toFixed(4)}vw` // 保留 4 位小数
    }

    // 其他情况原样返回
    return value
}
