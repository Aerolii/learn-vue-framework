/**
 * 解决副作用函数中读取或设置响应式数据时，
 * 由于分支而引发的副作用函数额外执行问题。
 * 例如：
 * const obj = {success: true, text: 'success'}
 * document.body.innerHTML = obj.success ? obj.text : 'error'
 *
 * 当 obj 对象的 success 属性为真时，其对应的副作用函数为两个
 * data
 *  - success
 *      - effectFn
 *  - text
 *      - effectFn
 *
 * 当 obj 对象的 success 属性为否时，其对应的副作用函数应该只为一个
 * data
 *  - success
 *      - effectFn
 */

const bucket = new WeakMap()

// 当前激活的副作用函数
let activeEffect = null

export const reactiveFn = (data) =>
  new Proxy(data, {
    get(target, key) {
      track(target, key)
      return target[key]
    },
    set(target, key, val) {
      target[key] = val
      trigger(target, key)
      return true
    }
  })

// 修改副作用函数
export const effectFn = (fn) => {
  const effect = () => {
    cleanup(effect)
    activeEffect = effect
    fn()
  }
  effect.deps = []
  effect()
}

const track = (target, key) => {
  if (!activeEffect) {
    return
  }
  // Map 集合
  let depsMap = bucket.get(target)
  if (!depsMap) {
    bucket.set(target, (depsMap = new Map()))
  }
  // Set 集合存储与之依赖的副作用函数
  let deps = depsMap.get(key)
  if (!deps) {
    depsMap.set(key, (deps = new Set()))
  }
  deps.add(activeEffect)
  console.log('deps :>> ', deps)
  console.log('bucket :>> ', bucket)

  // 将依赖副作用函数收集
  activeEffect.deps.push(deps)
  console.log('activeEffect.deps :>> ', activeEffect.deps)
}

const trigger = (target, key) => {
  const depsMap = bucket.get(target)
  if (depsMap) {
    const effects = depsMap.get(key)
    // 存储结构依然为 Set
    const effectsToRun = new Set(effects)
    // effects && effects.forEach((fn) => fn())
    effectsToRun.forEach((effectFn) => effectFn())
  }
}

const cleanup = (effect) => {
  for (let i = 0; i < effect.deps.length; i++) {
    const deps = effect.deps[i]
    deps.delete(effect)
  }
  effect.deps.length = 0
}
