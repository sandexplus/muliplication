import { angleToRads } from '@/utils/est/canvy/src/utils/angleToRads'
import { CircleParams } from '@/utils/est/canvy/src/types'

export const createGroup = (params: CircleParams[]) => {
  const create = () => {
    const standardParams: CircleParams = {
      x: 15,
      y: 15,
      radius: 15,
      startAngle: angleToRads(0),
      endAngle: angleToRads(360),
      strokeColor: '#000000',
      strokeWidth: 1,
      fillColor: '#000000',
      rotate: 0
    }

    return params.map(param => {
      if (param.endAngle) {
        param.endAngle = angleToRads(param.endAngle)
      }
      if (param.startAngle) {
        param.startAngle = angleToRads(param.startAngle)
      }

      return Object.assign(standardParams, param)
    })
  }

  return {
    create
  }
}
