/**
 * JS 基本类型校验函数
 */

/** ------------ 基础类型校验 ------------ */
/**
 * 检查是否为数组
 * @param value 待检查的值
 * @returns 是否为数组
 */
export function isArray<T>(value: unknown): value is T[] {
    return Array.isArray(value)
}

/**
 * 检查是否为对象（非null，非数组）
 * @param value 待检查的值
 * @returns 是否为普通对象
 */
export function isObject(value: unknown): value is Record<string, unknown> {
    return value !== null && typeof value === 'object' && !Array.isArray(value)
}

/**
 * 检查是否为函数
 * @param value 待检查的值
 * @returns 是否为函数
 */
export function isFunction(value: unknown): value is (...args: any[]) => any {
    return typeof value === 'function'
}

/**
 * 检查是否为字符串
 * @param value 待检查的值
 * @returns 是否为字符串
 */
export function isString(value: unknown): value is string {
    return typeof value === 'string'
}

/**
 * 检查是否为数字
 * @param value 待检查的值
 * @returns 是否为数字
 */
export function isNumber(value: unknown): value is number {
    return typeof value === 'number' && !isNaN(value)
}

/**
 * 检查是否为布尔值
 * @param value 待检查的值
 * @returns 是否为布尔值
 */
export function isBoolean(value: unknown): value is boolean {
    return typeof value === 'boolean'
}

/**
 * 检查是否为null或undefined
 * @param value 待检查的值
 * @returns 是否为null或undefined
 */
export function isNil(value: unknown): value is null | undefined {
    return value === null || value === undefined
}

/** ------------ 高级类型校验 ------------ */
/**
 * 检查是否为非空字符串
 * @param value 待检查的值
 * @returns 是否为非空字符串
 */
export function isNonEmptyString(value: unknown): value is string {
    return isString(value) && value.trim().length > 0
}

/**
 * 检查是否为有效数字（非NaN，有限数）
 * @param value 待检查的值
 * @returns 是否为有效数字
 */
export function isFiniteNumber(value: unknown): value is number {
    return isNumber(value) && isFinite(value)
}

/**
 * 检查是否为字面量对象（通过{}或new Object创建）
 * @param value 待检查的值
 * @returns 是否为字面量对象
 */
export function isPlainObject(value: unknown): value is Record<string, unknown> {
    if (!isObject(value)) return false
    const proto = Object.getPrototypeOf(value)
    return proto === null || proto === Object.prototype
}

/**
 * 检查是否为 Promise
 * @param value 待检查的值
 * @returns 是否为Promise
 */
export function isPromise<T = unknown>(value: unknown): value is Promise<T> {
    return isObject(value) && isFunction((value as any).then) && isFunction((value as any).catch)
}

/**
 * 检查是否为 Date 对象且有效
 * @param value 待检查的值
 * @returns 是否为有效Date
 */
export function isValidDate(value: unknown): value is Date {
    return value instanceof Date && !isNaN(value.getTime())
}

/** ------------ 高级类型校验 ------------ */
/**
 * 检查是否为特定类型的数组
 * @param value 待检查的值
 * @param checkItem 检查数组元素的函数
 * @returns 是否为特定类型的数组
 */
export function isArrayOf<T>(value: unknown, checkItem: (item: unknown) => item is T): value is T[] {
    if (!isArray(value)) return false
    for (const item of value) {
        if (!checkItem(item)) return false
    }
    return true
}

/**
 * 检查对象是否包含特定属性
 * @param value 待检查的值
 * @param key 属性键
 * @returns 对象是否包含该属性
 */
export function hasProperty<K extends string>(value: unknown, key: K): value is { [P in K]: unknown } {
    return isObject(value) && key in value
}

/**
 * 类型安全的 Object.keys
 * @param obj 对象
 * @returns 对象的键数组
 */
export function objectKeys<T extends object>(obj: T): Array<keyof T> {
    return Object.keys(obj) as Array<keyof T>
}
