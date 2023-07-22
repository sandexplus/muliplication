import { random } from '@/utils/random'
import { Ref } from 'vue'
import Canvy from '@/utils/canvy'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import MeteorImg from '@/assets/meteor.png'

export const drawMeteorWithText = async (canvasRef: Ref<HTMLCanvasElement | null>, canvy: Ref<Canvy>, id: string, text: string) => {
  if (!canvasRef.value) {
    return
  }

  const centerX = random(50, canvasRef.value ? canvasRef.value.width - 50 : 500)

  await canvy.value.drawImage(`meteor-${id}`, {
    src: MeteorImg,
    y: -50,
    x: centerX,
    width: 100,
    height: 100
  })

  canvy.value.drawRect(`banner-meteor-${id}`, {
    x: centerX,
    y: -150,
    width: 250,
    height: 100
  })

  canvy.value.drawText(`text-meteor-${id}`, {
    text: text,
    fillColor: 'white',
    font: '48px sans-serif',
    strokeColor: '#000000',
    x: centerX + 125,
    y: -100
  })
}
