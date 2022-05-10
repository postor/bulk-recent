import { getFunction } from "..";

test('basic', async () => {
  let greet = getFunction<[name: string], string>(async (tasks) => tasks.map(([x]) => `Hello ${x}!`))
  let p1 = greet('Li'), p2 = greet('Han')
  expect(await Promise.all([p1, p2])).toStrictEqual(['Hello Li!', 'Hello Han!'])
}, 3000)

test('wait', (cb) => {
  let tasks = new Array(10).fill(0).map((x, i) => (i + 1) * 300)
  let fn = getFunction<[number], [number, Date]>(async (tasks) => tasks.map(([x]) => [x, new Date]), 300 + tasks[tasks.length - 1])
  let promises = tasks.map(x => Promise.resolve([0, new Date] as [number, Date]))
  tasks.forEach((x, i) => setTimeout(() => promises[i] = fn(x), x))
  setTimeout(async () => {
    let results = await Promise.all(promises)
    console.log(results,`time shall be the same`)
    expect(results.some(x => !x[0])).toBe(false)
    cb()
  }, 300 + tasks[tasks.length - 1])
}, 30000)


test('wait in groups', (cb) => {
  let tasks = new Array(10).fill(0).map((x, i) => (i + 1) * 300)
  let fn = getFunction<[number], [number, Date]>(async (tasks) => tasks.map(([x]) => [x, new Date]), 1000)
  let promises = tasks.map(x => Promise.resolve([0, new Date] as [number, Date]))
  tasks.forEach((x, i) => setTimeout(() => promises[i] = fn(x), x))
  setTimeout(async () => {
    let results = await Promise.all(promises)
    console.log(results,`time shall in groups`)
    expect(results.some(x => !x[0])).toBe(false)
    cb()
  }, 300 + tasks[tasks.length - 1])
}, 30000)