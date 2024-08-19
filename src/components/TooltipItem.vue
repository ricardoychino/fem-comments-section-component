<script setup lang="ts">
import type { TooltipThemes } from '@/types/Tooltips'
import ButtonIcon from './ButtonIcon.vue'

withDefaults(
  defineProps<{
    theme?: TooltipThemes
    closable?: boolean
  }>(),
  {
    theme: 'neutral',
    closable: false
  }
)

defineEmits<{
  close: []
}>()
</script>

<template>
  <span class="tooltip" :class="`tooltip-${theme}`">
    <slot></slot>
    <button v-if="closable" @click="$emit('close')">
      <ButtonIcon type="close" />
    </button>
  </span>
</template>

<style lang="scss" scoped>
@mixin shadow($color) {
  box-shadow: 0 1px 10px 0 #{$color}b3;
}
.tooltip {
  display: inline-flex;
  align-items: center;
  color: #fff;
  padding: 10px 20px;
  border-radius: 15px;

  button {
    color: inherit;
    padding: 5px;
    margin-left: 10px;
    margin-right: -10px;
    background-color: transparent;

    &:hover {
      background-color: #33333333;
    }
  }

  &-neutral {
    background-color: $neutral-900;
    @include shadow($neutral-900);
  }
  &-primary {
    background-color: $color-primary;
    @include shadow($color-primary);
  }
  &-success {
    background-color: $color-success;
    @include shadow($color-success);
  }
  &-danger {
    background-color: $color-danger;
    @include shadow($color-danger);
  }
}
</style>
