import { AnimationOptions } from '@/utils/canvy/types'
import { colorString } from '@/utils/est/canvy/src/utils/colorString'

export const animate = (element: any, params: any, duration = 1000, callback?: () => void) => {
  const startParams = element.params

  const calcStep = (oldVal: number, newVal: number, progress: number) => {
    return Math.floor(progress * (newVal - oldVal) + oldVal)
  }

  const animate = (options: AnimationOptions) => {
    const { params, startParams, duration } = options

    let startTimestamp = performance.now()
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp
      const progress = Math.min((timestamp - startTimestamp) / duration, 1)
      for (const key in params) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        if (typeof params[key] === 'string') {
          element.params[key] = colorString([
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            calcStep(colorString(startParams[key])[0] as number, colorString(params[key])[0] as number, progress),
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            calcStep(colorString(startParams[key])[1] as number, colorString(params[key])[1] as number, progress),
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            calcStep(colorString(startParams[key])[2] as number, colorString(params[key])[2] as number, progress)
          ])
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
        } else if (Array.isArray(params[key])) {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          for (let i = 0; i < params[key].length; i++) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            element.params[key][i][0] = calcStep(startParams[key][i][0], params[key][i][0], progress)
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            element.params[key][i][1] = calcStep(startParams[key][i][1], params[key][i][1], progress)
          }
        } else {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          element.params[key] = calcStep(startParams[key], params[key], progress)
        }

        element.draw()
      }

      if (progress < 1 && element.animationQueue.length) {
        window.requestAnimationFrame(step)
      } else {
        if (element.inCycle) {
          element.animationQueue.splice(0, 1)
          if (element.animationQueue.length > 0) {
            animate(
              element.animationQueue[0]
            )
          }
        } else {
          if (typeof callback === 'function') {
            callback()
          }
          element.animationQueue = []
        }
      }
    }
    window.requestAnimationFrame(step)
  }

  if (element.animationQueue.length === 0) {
    element.animationQueue.push({
      params,
      startParams,
      duration
    })
    animate(element.animationQueue[0])
  } else {
    element.animationQueue.push({
      params,
      startParams: element.animationQueue[element.animationQueue.length - 1].params,
      duration
    })
  }
}
