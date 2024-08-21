<script lang="ts" setup>
import ButtonIcon from '@/components/ButtonIcon.vue'

defineProps<{
  isLoading: boolean
}>()

defineEmits<{
  click: []
}>()
</script>

<template>
  <button
    v-bind="$attrs"
    :class="{ __loading__active: isLoading }"
    :disabled="isLoading"
    @click="$emit('click')"
  >
    <ButtonIcon v-show="isLoading" class="__btn__loading" type="loading" />
    <span class="__btn__content">
      <slot></slot>
    </span>
  </button>
</template>

<style scoped>
button {
  position: relative;
}
.__btn__loading {
  position: absolute;
}
.__loading__active > .__btn__content {
  opacity: 0;
}
</style>
