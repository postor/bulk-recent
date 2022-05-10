/**
 * get a function like doing single task
 * @param bulkHandle deal things in bulk 
 * @param wait miliseconds to wait, case 0 use `Promise.resolve`, else `setTimeout`
 * @returns function that you call separately, they are auto collected and run in bulk
 */
export function getFunction<TARG extends any[], TRTN>(bulkHandle: (tasks: TARG[]) => Promise<TRTN[]>, wait = 0) {
  type Batch = {
    q: TARG[],
    p: Promise<TRTN[]>
  }

  let batch: Batch | undefined

  return (...args: TARG) => {
    if (!batch) batch = createBatch()
    let { p, q } = batch
    let i = q.length
    q[i] = args
    return p.then(arr => arr[i])
  }

  function createBatch(): Batch {
    let t: Batch = {
      q: [], p: waitConcat().then(() => {
        batch = undefined
        return bulkHandle(t.q)
      })
    }
    return t
  }

  function waitConcat() {
    return wait ? new Promise(r => setTimeout(r, wait)) : Promise.resolve()
  }

}

export default getFunction