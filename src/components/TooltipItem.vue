<script setup lang="ts">
withDefaults(
  defineProps<{
    theme?: string
  }>(),
  {
    theme: 'neutral'
  }
)
</script>

<template>
  <span class="tooltip" :class="`tooltip-${theme}`">
    <slot></slot>
  </span>
</template>

<style lang="scss" scoped>
@mixin shadow($color) {
  box-shadow: 0 1px 10px 0 #{$color}b3;
}
.tooltip {
  display: inline-block;
  color: #fff;
  padding: 10px 20px;
  border-radius: 15px;

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
