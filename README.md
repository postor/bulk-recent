# bulk-recent
collect recent opts and run in bulk | 收集最近的调用，并批量处理

## usage | 使用

API
```
/**
 * get a function like doing single task | 获取一个函数用于注册单个任务
 * @param bulkHandle deal things in bulk | 用于批量处理的回调
 * @param wait miliseconds to wait, case 0 use `Promise.resolve`, else `setTimeout` | 等待时间，毫秒，默认使用`Promise.resolve`，非 0 使用 `setTimeout`
 * @returns a function like doing single task | 一个用于注册单个任务的函数
 */
function getFunction<TARG extends any[], TRTN>(bulkHandle: (tasks: TARG[]) => Promise<TRTN[]>, wait?: number): (...args: TARG) => Promise<TRTN>;
```

example | 示例
```
import getFunction from 'bulk-recent'

// collect all greets before `Promise.resolve`,  that means started synchronously | 收集同步代码段中的调用并批量
let greet = getFunction<[name: string], string>(async (tasks) => tasks.map(([x]) => `Hello ${x}!`)) 

// collect all greets in 1 second | 收集 1 秒内的调用并批量
// let greet = getFunction<[name: string], string>(async (tasks) => tasks.map(([x]) => `Hello ${x}!`))

greet('Li').then(x=>console.log(x)) //> 'Hello Li!'
greet('Han').then(x=>console.log(x)) //> 'Hello Han!'
```

## Don't | 不要这样使用

Don't use like this, this case each bulk will run single task only |不要这样使用，这样每次批量只会运行单个任务
```
let greet = getFunction<[name: string], string>(async (tasks) => tasks.map(([x]) => `Hello ${x}!`)) 

let li = await greet('Li')
let han = await greet('Han')
```