import { Ref } from 'vue'
import Canvy from '@/utils/canvy'

export const animateStuff = (canvasRef: Ref<HTMLCanvasElement | null>, canvy: Ref<Canvy>, id: string, currentSpeed: Ref<number>) => {
  canvy.value.animate(`banner-meteor-${id}`, {
    y: canvasRef.value ? canvasRef.value.height - 150 : 500,
    x: canvasRef.value ? canvasRef.value.width / 2 - 50 : 200
  }, 5000 / currentSpeed.value)

  canvy.value.animate(`meteor-${id}`, {
    y: canvasRef.value ? canvasRef.value.height : 500,
    x: canvasRef.value ? canvasRef.value.width / 2 - 50 : 200,
    rotate: 360
  },
  5000 / currentSpeed.value,
  () => {
    // destroyMeteor(id)
  })

  canvy.value.animate(`text-meteor-${id}`, {
    y: canvasRef.value ? canvasRef.value.height - 100 : 500,
    x: canvasRef.value ? canvasRef.value.width / 2 : 200
  },
  5000 / currentSpeed.value)
}
