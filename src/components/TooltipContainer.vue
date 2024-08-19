<script setup lang="ts">
import { ref } from 'vue'
import TooltipItem from '@/components/TooltipItem.vue'

const props = withDefaults(
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

const list = ref([
  {
    theme: 'danger',
    message: 'fail'
  },
  {
    theme: 'neutral',
    message: 'well wll'
  },
  {
    theme: 'success',
    message: 'success!'
  },
  {
    theme: 'primary',
    message: 'Primo ary'
  }
])

const interval1 = setInterval(() => {
  list.value.unshift({
    theme: list.value[list.value.length - 1].theme,
    message: `Toooltip de numero ${list.value.length}`
  })
}, 2000)

const interval2 = setInterval(() => {
  list.value.pop()
}, 3000)

setTimeout(() => {
  clearInterval(interval1)
  clearInterval(interval2)
}, 30000)
</script>

<template>
  <Teleport to="body">
    <div class="tooltips-container" :data-pos="position">
      <TransitionGroup name="tooltip-list">
        <TooltipItem v-for="{ theme, message } in list" v-bind:theme :key="`${theme}-${message}`">
          {{ message }}
        </TooltipItem>
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
.tooltips-container {
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
    .tooltip-list-enter-from,
    .tooltip-list-leave-to {
      transform: translateX(-30px);
    }
  }
  &[data-pos$='-right'] {
    .tooltip-list-enter-from,
    .tooltip-list-leave-to {
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
@include vue-transition('tooltip-list') {
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
