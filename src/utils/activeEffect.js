/**
 * 解决副作用函数中读取或设置响应式数据时，
 * 由于分支而引发的副作用函数额外执行问题。
 */

const bucket = new WeakMap()

let activeEffect = null
