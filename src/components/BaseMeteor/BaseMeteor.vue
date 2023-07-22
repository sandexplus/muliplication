<template>
  <div class="meteor p-10 absolute w-max" :style="{left: leftOffset + 'px', top: top + 'px'}">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { Meteor } from '@/components/BaseMeteor/types'
import { onMounted, ref } from 'vue'
import { drawMeteor } from '@/components/BaseMeteor/utils/drawMeteor'
import Canvy from '@/utils/canvy'
import { random } from '@/utils/random'
import { CircleParams } from '@/utils/canvy/types'

interface Props extends Meteor{
  canvas: HTMLCanvasElement | null
  id: string | number,
  canvy: Canvy
  value: string
}

const props = defineProps<Props>()
const emits = defineEmits(['destroyed'])

const top = ref(0)

onMounted(() => {
  const centerX = random(50, 500)

  props.canvy.drawCircle(`meteor-${props.id}`, {
    centerX,
    radius: 50,
    fillColor: '#ffffff'
  })

  props.canvy.drawText(`text-meteor-${props.id}`, {
    text: props.value,
    fillColor: '#000000',
    strokeColor: '#000000',
    x: centerX - 25,
    y: 25
  })

  props.canvy.toTop(`text-meteor-${props.id}`)

  props.canvy.animate(`meteor-${props.id}`, {
    centerY: 450
  },
  5000 / props.speed,
  () => {
    props.canvy.remove(`meteor-${props.id}`)
    props.canvy.remove(`text-meteor-${props.id}`)
    emits('destroyed', props.id)
  })

  props.canvy.animate(`text-meteor-${props.id}`, {
    y: 450
  },
  5000 / props.speed)
})
</script>

<style scoped lang="scss">
.meteor {

}
</style>
