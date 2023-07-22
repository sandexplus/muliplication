<template>
  <div class="w-max">
    <input type="text" class="input" :value="modelValue" @input="emits('update:model-value', $event.target.value)" @keydown.enter="emits('submit')" />
  </div>
</template>

<script setup lang="ts">
interface Props {
  modelValue: string
}

defineProps<Props>()
const emits = defineEmits(['update:model-value', 'submit'])
</script>

<style scoped lang="scss">
.input {
  border: 1px solid #000;
}
</style>
