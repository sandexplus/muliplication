import { createCircle } from '@/utils/est/canvy/src/circle'
import { createGroup } from '@/utils/est/canvy/src/group'
import { paramsNormalize } from '@/utils/est/canvy/src/utils/paramsNormalize'
import { CircleParams, Element, ImageParams, RectParams } from '@/utils/est/canvy/src/types'
import { generateId } from '@/utils/est/canvy/src/utils/generateId'
import { addToDrown } from '@/utils/est/canvy/src/utils/addToDrown'
import { createRect } from '@/utils/est/canvy/src/rect'
import { createImage } from '@/utils/est/canvy/src/image'
import { animate } from '@/utils/est/canvy/src/utils/animate'

export default (canvas: HTMLCanvasElement) => {
  const id = `canvy-${generateId()}`
  const ctx = canvas.getContext('2d')
  const canvasWidth = canvas.width
  const canvasHeight = canvas.height
  let drownElements: Element[] = []

  const create = (type: string, params?: Partial<CircleParams | RectParams | ImageParams>): Element => {
    switch (type) {
      case 'circle': {
        const element = createCircle(canvas, ctx!, params)

        const elementWithAnimate: Element = {
          ...element,
          animate: (params: Partial<CircleParams>, duration?: number, callback?: () => void) => animate(element, params, duration, callback)
        }

        drownElements = addToDrown(drownElements, elementWithAnimate)
        return elementWithAnimate
      }
      case 'rect': {
        const element = createRect(canvas, ctx!, params)

        const elementWithAnimate: Element = {
          ...element,
          animate: (params: Partial<RectParams>, duration?: number, callback?: () => void) => animate(element, params, duration, callback)
        }

        drownElements = addToDrown(drownElements, elementWithAnimate)
        return elementWithAnimate
      }
      case 'image': {
        const element = createImage(canvas, ctx!, params)

        const elementWithAnimate: Element = {
          ...element,
          animate: (params: Partial<ImageParams>, duration?: number, callback?: () => void) => animate(element, params, duration, callback)
        }

        drownElements = addToDrown(drownElements, elementWithAnimate)
        return elementWithAnimate
      }
      // case 'group': {
      //   const elements = createGroup(paramsNormalize(params) as CircleParams[])
      //   drownElements.push(elements)
      //   return elements
      // }
      default:
        throw new Error('Invalid Canvy type')
    }
  }

  const drawAll = async (elements?: any[]) => {
    // TODO: make possibility to draw only gotten elements
    for (const item of drownElements) {
      await item.draw()
    }
  }

  const getDrawnElements = () => {
    return drownElements
  }

  return {
    create,
    getDrawnElements,
    id,
    drawAll
  }
}
