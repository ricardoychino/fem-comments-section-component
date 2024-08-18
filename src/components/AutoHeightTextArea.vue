<script setup lang="ts">
import { ref, watch, nextTick, onMounted } from 'vue'

withDefaults(
  defineProps<{
    rows?: string | number
  }>(),
  {
    rows: 3
  }
)

const modelValue = defineModel<string>()

const el = ref<HTMLTextAreaElement | null>(null)

const adjustSize = async () => {
  if (!el.value) return

  el.value.style.height = 'auto'
  await nextTick()
  el.value.style.height = `${el.value.scrollHeight}px`
}

watch(modelValue, adjustSize)

onMounted(adjustSize)
</script>

<template>
  <textarea ref="el" v-model="modelValue" v-bind="$attrs" :rows="rows"></textarea>
</template>

<style lang="scss" scoped>
textarea {
  font-family: inherit;
  font-size: inherit;
  width: 100%;
  overflow: hidden;
  border: 1px solid $neutral-400;
  border-radius: 10px;
  padding: 10px 20px;

  &:focus,
  &:focus-within,
  &:focus-visible {
    border-color: $color-primary;
    outline-color: $color-primary;
  }
}
</style>
