<script setup lang="ts">
import ToastItem from '@/components/ToastItem.vue'

import { useToastsStore } from '@/stores/toast'
import { storeToRefs } from 'pinia'

withDefaults(
  defineProps<{
    position?:
      | 'top-left'
      | 'top-center'
      | 'top-right'
      | 'bottom-left'
      | 'bottom-center'
      | 'bottom-right'
  }>(),
  {
    position: 'top-center'
  }
)
const store = useToastsStore()
const { toasts } = storeToRefs(store)
</script>

<template>
  <Teleport to="body">
    <div class="toasts-container" :data-pos="position">
      <TransitionGroup name="toasts-list">
        <ToastItem
          v-for="item in toasts"
          :theme="item.theme"
          :closable="item.closable"
          @close="item.handleClose"
          :key="item.key"
        >
          {{ item.text }}
        </ToastItem>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<style lang="scss" scoped>
@mixin top-pos {
  top: 0;
}
@mixin left-pos {
  left: 0;
  align-items: flex-start;
}
@mixin right-pos {
  right: 0;
  align-items: flex-end;
}
@mixin bottom-pos {
  bottom: 0;
}
@mixin center-pos {
  @include left-pos;
  @include right-pos;
  align-items: center;
}
.toasts-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
  position: fixed;
  padding: 15px;
  height: 0;
  overflow: visible;

  // &[data-pos^='top-'] {
  // }
  &[data-pos^='bottom-'] {
    flex-direction: column-reverse;
  }
  &[data-pos$='-left'] {
    .toasts-list-enter-from,
    .toasts-list-leave-to {
      transform: translateX(-30px);
    }
  }
  &[data-pos$='-right'] {
    .toasts-list-enter-from,
    .toasts-list-leave-to {
      transform: translateX(30px);
    }
  }

  &[data-pos='top-left'] {
    @include top-pos;
    @include left-pos;
  }
  &[data-pos='top-center'] {
    @include top-pos;
    @include center-pos;
  }
  &[data-pos='top-right'] {
    @include top-pos;
    @include right-pos;
  }
  &[data-pos='bottom-left'] {
    @include bottom-pos;
    @include left-pos;
  }
  &[data-pos='bottom-center'] {
    @include bottom-pos;
    @include center-pos;
  }
  &[data-pos='bottom-right'] {
    @include bottom-pos;
    @include right-pos;
  }
}

/* Transition mixin (@/assets/css/mixins.scss) */
@include vue-transition('toasts-list') {
  &__active {
    position: relative;
    opacity: 1;
  }
  &__inactive {
    opacity: 0;
  }
  &-move,
  &__transition-in {
    transition: all 0.5s ease;
  }
  &__transition-out {
    transition: all 0.3s ease-out;
  }
}
</style>
