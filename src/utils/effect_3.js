/**
 * 封装响应式数据系统
 */
// WeakMap 与 Map 相比，其优点是 key 采用弱引用，不会影响垃圾回收机制。
const bucket = new WeakMap()

let activeEffect = null

export const reactiveFn = (data) =>
  new Proxy(data, {
    get(target, p) {
      track(target, p)
      return target[p]
    },

    set(target, p, v) {
      target[p] = v
      return trigger(target, p)
    }
  })

// 捕获读取操作，并存储副作用函数
const track = (target, key) => {
  if (!activeEffect) {
    return
  }
  let depsMap = bucket.get(target)
  // 如果不存在，需要建立关联
  if (!depsMap) {
    bucket.set(target, (depsMap = new Map()))
  }
  let deps = depsMap.get(key)
  if (!deps) {
    depsMap.set(key, (deps = new Set()))
  }

  deps.add(activeEffect)
}

// 拦截设置操作，并执行与之相关的副作用函数
const trigger = (target, key) => {
  const depsMap = bucket.get(target)
  if (!depsMap) {
    return true
  }
  const effects = depsMap.get(key)
  effects && effects.forEach((fn) => fn())
  return true
}

export const effectFn = (fn) => {
  activeEffect = fn
  fn()
}
