/** 函数柯里化 */
type CurryFn<T extends any[], R> = T extends [infer First, ...infer Rest] ? (arg: First) => CurryFn<Rest, R> : R
export function curry<T extends any[], R>(fn: (...args: T) => R): CurryFn<T, R> {
    return function _curry(...args: any[]): any {
        return args.length >= fn.length ? fn(...(args as T)) : (...nextArgs: any[]) => _curry(...args, ...nextArgs)
    } as CurryFn<T, R>
}

// -- 对象过滤
export function cloneObjectPropertiesByKeys(target: Record<string, any>, keys: string[]) {
    const result: Record<string, any> = {}
    for (const key in target) {
        if (keys.includes(key)) {
            result[key] = target[key]
        }
    }
    return result
}
