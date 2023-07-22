import { Ref } from 'vue'
import Canvy from '@/utils/canvy'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import BackgroundImg from '@/assets/bg.jpg'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import UfoImg from '@/assets/ufo.png'

export const drawStuff = async (canvasRef: Ref<HTMLCanvasElement | null>, canvy: Ref<Canvy>) => {
  if (!canvasRef.value) {
    return
  }

  await canvy.value.drawImage('image', {
    src: BackgroundImg,
    width: canvasRef.value ? canvasRef.value.width : 1000,
    height: canvasRef.value ? canvasRef.value.height : 500
  })

  await canvy.value.drawImage('ufo', {
    src: UfoImg,
    width: canvasRef.value ? canvasRef.value.width / 5 : 500,
    x: canvasRef.value ? canvasRef.value.width / 2 - canvasRef.value.width / 10 : 700,
    height: 200,
    y: canvasRef.value ? canvasRef.value.height - 150 : 400
  })
}
