import { random } from '@/utils/random'
import { ref } from 'vue'
import { getId } from '@/components/BaseMeteor/utils/getId'
import { Meteor } from '@/components/BaseMeteor/types'

const meteors = ref<Omit<Meteor, 'speed'>[]>([])

export const createMeteorObject = () => {
  const firstNum = random(1, 9)
  const secondNum = random(1, 9)

  meteors.value.push({
    leftOffset: random(0, 1000),
    value: `${firstNum} * ${secondNum}`,
    answer: `${firstNum * secondNum}`,
    id: getId()
  })

  return {
    meteors,
    created: meteors.value[meteors.value.length - 1]
  }
}
