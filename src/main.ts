import './style.css'
// import { setupCounter } from './counter.ts'

// import { effect, reactive } from './utils/effect'

// import { reactive as reactiveFn, effect as effect_2 } from './utils/effect_2'

import { reactiveFn, effectFn } from './utils/effect_3.js'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <p id="data"></p>
    <div class="card">
      <button id="counter" type="button">hi</button>
    </div>
    <div class="card">
      <button id="counter1" type="button">hi</button>
    </div>
       <div class="card">
      <button id="counter2" type="button">hi</button>
    </div>
    <p class="read-the-docs">
      Click on the Vite and TypeScript logos to learn more
    </p>
    </div>
    `
// setupCounter(document.querySelector('#counter')!)

// const obj = reactive({ text: 'click me' })

// const btn = document.querySelector('#counter')!
// btn.addEventListener('click', () => (obj.text += '1'))

// effect(() => {
//   btn.innerHTML = obj.text
// })

const obj2 = reactiveFn({ text: '1' })
const btn2 = document.querySelector('#counter1')!
btn2.addEventListener('click', () => (obj2.text += '2'))

const obj3 = reactiveFn({ text: '2' })
const btn3 = document.querySelector('#counter2')!
btn3.addEventListener('click', () => (obj3.text += '3'))

effectFn(() => {
  console.log('1 :>> ', 1)
  btn2.innerHTML = obj2.text
  btn3.innerHTML = obj3.text
})

// effect_2(() => {
//   console.log('2 :>> ', 2)
//   btn3.innerHTML = obj3.text
// })
