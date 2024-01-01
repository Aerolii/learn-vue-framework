interface EffectFn {
  (arg?: any): void
}

const bucket = new Set()

let activeEffect: EffectFn

export const reactive = <T extends { [k: string | symbol]: any }>(
  obj: T
): T => {
  return new Proxy(obj, {
    get(target: T, p) {
      if (activeEffect) {
        bucket.add(activeEffect)
      }
      return target[p]
    },
    set(target: any, p, val) {
      target[p] = val
      bucket.forEach((fn: any) => fn())
      return true
    }
  })
}

export const effect: EffectFn = (fn: EffectFn) => {
  activeEffect = fn
  console.log(activeEffect)
  fn()
}
