const bucket = new WeakMap()

let activeEffect: any = null

export const effect = (fn: any) => {
  activeEffect = fn
  fn()
}

export const reactive = (o: any) =>
  new Proxy(o, {
    get(target, k) {
      if (!activeEffect) {
        return target[k]
      }
      // depsMap is Map
      let depsMap = bucket.get(target)
      if (!depsMap) {
        bucket.set(target, (depsMap = new Map()))
      }
      // deps is Set
      let deps = depsMap.get(k)
      if (!deps) {
        depsMap.set(k, (deps = new Set()))
      }
      deps.add(activeEffect)
      return target[k]
    },
    set(target, k, val) {
      target[k] = val
      const depsMap = bucket.get(target)
      if (!depsMap) {
        return true
      }
      const effects = depsMap.get(k)
      effects && effects.forEach((fn: any) => fn())
      return true
    }
  })
