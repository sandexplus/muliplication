import { ImageParams } from '@/utils/canvy/types'
import { Ref } from 'vue'
import Canvy from '@/utils/canvy'
import { getId } from '@/components/BaseMeteor/utils/getId'

export const fire = (canvasRef: Ref<HTMLCanvasElement | null>, canvy: Ref<Canvy>, meteorId: string) => {
  const id = getId()

  canvy.value.drawCircle(`bullet-${id}`, {
    radius: 15,
    fillColor: 'red',
    centerX: canvasRef.value ? canvasRef.value.width / 2 : 700,
    centerY: canvasRef.value ? canvasRef.value.height : 400
  })

  const meteorParams = canvy.value.get(`meteor-${meteorId}`).params as ImageParams

  canvy.value.animate(`bullet-${id}`, {
    centerX: meteorParams.x,
    centerY: meteorParams.y
  }, 200, () => {
    canvy.value.remove(`bullet-${id}`)
  })
}
