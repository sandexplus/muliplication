import { Element, RectParams } from '@/utils/est/canvy/src/types'
import { generateId } from '@/utils/est/canvy/src/utils/generateId'
import { animate } from '@/utils/est/canvy/src/utils/animate'

export function createRect (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, params?: Partial<RectParams>): Omit<Element, 'animate' | 'stopAnimate'> {
  const id = `canvy-rect-${generateId()}`
  const currentParams: RectParams = {
    x: 15,
    y: 15,
    width: 100,
    height: 50,
    strokeColor: '#000000',
    strokeWidth: 1,
    fillColor: '#000000',
    rotate: 0,
    z: 0
  }

  const normalizedParams = Object.assign(currentParams, params)

  const draw = (): Promise<void> => {
    return new Promise((resolve) => {
      ctx.beginPath()
      const figure = new Path2D()

      figure.moveTo(currentParams.x, currentParams.y)
      figure.rect(
        currentParams.x,
        currentParams.y,
        currentParams.width,
        currentParams.height
      )

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
