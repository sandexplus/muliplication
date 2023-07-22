import { ImageParams, Element } from '@/utils/est/canvy/src/types'
import { generateId } from '@/utils/est/canvy/src/utils/generateId'

export const createImage = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, params?: Partial<ImageParams>): Omit<Element, 'animate' | 'stopAnimate'> => {
  const id = `canvy-image-${generateId()}`
  const currentParams: ImageParams = {
    src: '',
    x: 15,
    y: 15,
    rotate: 0,
    z: 0,
    width: 150,
    height: 50
  }

  const normalizedParams = Object.assign(currentParams, params)

  const loadImage = (): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const image = new Image()
      image.onload = () => resolve(image)
      image.onerror = reject
      image.src = currentParams.src
    })
  }

  const draw = async (): Promise<void> => {
    return new Promise((resolve) => {
      ctx.beginPath()
      const figure = new Path2D()

      loadImage().then((image) => {
        ctx.drawImage(image, currentParams.x, currentParams.y, currentParams.width, currentParams.height)

        ctx.fill(figure)
        ctx.stroke(figure)
        ctx.closePath()
        resolve()
      })
    })
  }

  return {
    draw,
    id,
    params: normalizedParams,
    animationQueue: []
  }
}
