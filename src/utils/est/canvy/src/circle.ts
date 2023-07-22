import { angleToRads } from '@/utils/est/canvy/src/utils/angleToRads'
import { CircleParams, Element } from '@/utils/est/canvy/src/types'
import { generateId } from '@/utils/est/canvy/src/utils/generateId'

export const createCircle = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, params?: Partial<CircleParams>): Omit<Element, 'animate' | 'stopAnimate'> => {
  const id = `canvy-circle-${generateId()}`
  const currentParams = {
    x: 15,
    y: 15,
    radius: 15,
    startAngle: 0,
    endAngle: 360,
    strokeColor: '#000000',
    strokeWidth: 1,
    fillColor: '#000000',
    rotate: 0,
    z: 0
  }

  const normalizedParams = Object.assign(currentParams, params)

  if (normalizedParams.endAngle) {
    normalizedParams.endAngle = angleToRads(normalizedParams.endAngle)
  }
  if (normalizedParams.startAngle) {
    normalizedParams.startAngle = angleToRads(normalizedParams.startAngle)
  }

  const draw = (): Promise<void> => {
    return new Promise((resolve) => {
      ctx.beginPath()
      const figure = new Path2D()

      figure.arc(
        currentParams.x,
        currentParams.y,
        currentParams.radius,
        0,
        360,
        false)

      ctx.fillStyle = currentParams.fillColor
      ctx.fill(figure)
      ctx.lineWidth = currentParams.strokeWidth
      ctx.strokeStyle = currentParams.strokeColor
      ctx.stroke(figure)
      ctx.closePath()

      resolve()
    })
  }

  return {
    draw,
    id,
    params: normalizedParams,
    animationQueue: []
  }
}
