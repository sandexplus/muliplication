import { generateId } from '@/utils/est/canvy/src/utils/generateId'
import { angleToRads } from '@/utils/est/canvy/src/utils/angleToRads'
import { Params } from '@/utils/canvy/types'
import { CircleParams } from '@/utils/est/canvy/src/types'

export const createPie = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, params?: Partial<CircleParams>) => {
  const id = `canvy-pie-${generateId()}`
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

  const draw = () => {
    ctx.beginPath()
    const figure = new Path2D()

    figure.arc(
      currentParams.x,
      currentParams.y,
      currentParams.radius,
      0,
      360,
      false)

    ctx.fillStyle = (currentParams as Params).fillColor
    ctx.fill(figure)
    ctx.lineWidth = (currentParams as Params).strokeWidth
    ctx.strokeStyle = (currentParams as Params).strokeColor
    ctx.stroke(figure)
    ctx.closePath()
  }

  return {
    draw,
    id,
    params: normalizedParams
  }
}
