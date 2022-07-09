import { act } from "react-dom/test-utils"

/**
 * A Testing helper function to wait for stacked promises to resolve
 *
 * @function waitFor
 * @param callback - a callback function to invoke after resolving promises
 * @param timeout - amount of time in milliseconds to wait before throwing an error
 * @returns promise
 */
const waitFor = (callback: () => void, timeOut = 1000): Promise<any> =>
  act(
    () =>
      new Promise((resolve, reject) => {
        const startTime = Date.now()

        const tick = () => {
          setTimeout(() => {
            try {
              resolve(callback())
            } catch (err: any) {
              if (Date.now() - startTime > timeOut) {
                reject(new Error(err))
              } else {
                tick()
              }
            }
          }, 10)
        }

        tick()
      })
  )

export default waitFor
