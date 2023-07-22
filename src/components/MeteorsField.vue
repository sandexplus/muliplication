<template>
  <canvas width="1000" height="500" ref="canvasRef"></canvas>
  <base-input class="mx-auto" v-model="inputValue" @submit="handleInput"/>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import BaseInput from '@/components/BaseInput.vue'
import { Meteor } from '@/components/BaseMeteor/types'
import Canvy from '@/utils/canvy'
import { drawStuff } from '@/components/BaseMeteor/utils/drawStuff'
import { animateStuff } from '@/components/BaseMeteor/utils/animateStuff'
import { createMeteorObject } from '@/components/BaseMeteor/utils/createMeteorObject'
import { fire } from '@/components/BaseMeteor/utils/fire'
import { drawMeteorWithText } from '@/components/BaseMeteor/utils/drawMeteor'

const canvasRef = ref<HTMLCanvasElement | null>(null)
const meteors = ref<Omit<Meteor, 'speed'>[]>([])

const inputValue = ref('')
const currentSpeed = ref(1)

const canvy = computed(() => new Canvy(canvasRef.value))

const drawMeteor = async (meteor: Omit<Meteor, 'speed'>) => {
  await drawMeteorWithText(canvasRef, canvy, meteor.id, meteor.value)

  canvy.value.toTop(`text-meteor-${meteor.id}`)
  canvy.value.toTop('ufo')

  animateStuff(canvasRef, canvy, meteor.id, currentSpeed)
}

const resizeCanvas = () => {
  if (canvasRef.value) {
    canvasRef.value.width = window.innerWidth
    canvasRef.value.height = window.innerHeight - 50
  }
}

const handleInput = () => {
  const destroyedMeteors = meteors.value.filter(item => {
    return item.answer === inputValue.value
  })
  inputValue.value = ''
  bulletCount.value++
  destroyedMeteors.forEach(item => {
    fire(canvasRef, canvy, item.id)
    destroyMeteor(item.id, true)
  })
}

onMounted(() => {
  resizeCanvas()

  window.addEventListener('resize', resizeCanvas)

  setInterval(() => {
    const meteor = createMeteorObject()
    meteors.value.push(meteor.created)
    drawMeteor(meteor.created)
  }, 1500)

  drawStuff(canvasRef, canvy)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', resizeCanvas)
})

const bulletCount = ref(0)

const destroyMeteor = (id: string | number, isInput?: boolean) => {
  const destroyedMeteors = meteors.value.filter(item => {
    return item.id.toString() === id.toString() || (isInput ? inputValue.value === item.answer : true)
  })

  meteors.value = meteors.value.filter(item => {
    return item.answer !== inputValue.value && item.id !== id
  })

  destroyedMeteors.forEach(item => {
    canvy.value.remove(`text-meteor-${item.id}`)
    canvy.value.remove(`meteor-${item.id}`)
    canvy.value.remove(`banner-meteor-${item.id}`)
  })
}
</script>

<style scoped lang="scss">

</style>
