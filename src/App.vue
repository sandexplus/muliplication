<template>
  <div>
    <canvas ref="canvasRef" width="1000" height="500"></canvas>
    <router-view/>
  </div>
</template>

<style lang="scss">
@import url("@/assets/tailwind.css");
</style>
<script setup lang="ts">
import { createCanvy } from '@/utils/est/canvy/'
import { onMounted, ref } from 'vue'
import Meteor from '@/assets/meteor.png'
import BG from '@/assets/bg.jpg'
import Ufo from '@/assets/ufo.png'

const canvasRef = ref()

onMounted(() => {
  const canvy = createCanvy(canvasRef.value)

  const bg = canvy.create('image', {
    src: BG,
    width: 1000,
    height: 500,
    x: 0,
    y: 0
  })

  const image = canvy.create('image', {
    src: Meteor,
    width: 75,
    height: 75
  })

  const ufo = canvy.create('image', {
    src: Ufo,
    x: 350,
    y: 400,
    width: 250,
    height: 100
  })

  canvy.drawAll()
})
</script>
