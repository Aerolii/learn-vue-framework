const bucket = new Set()

const data = {
  text: 'click me'
}

export const effect = () => {
  const btn = document.querySelector('#counter') as HTMLButtonElement
  const dataView = document.querySelector('#data') as HTMLElement
  btn.innerText = obj.text
  dataView.innerText = obj.text
}

const obj = new Proxy(data, {
  get(target: any, p) {
    bucket.add(effect)
    return target[p]
  },
  set(target: any, p, newValue) {
    target[p] = newValue
    bucket.forEach((fn: any) => fn())
    return true
  }
})

export const setupCounter = (el: HTMLButtonElement) => {
  effect()
  el.addEventListener('click', () => {
    obj.text += '1'
  })
}
