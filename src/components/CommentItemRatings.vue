<script setup lang="ts">
import ButtonIcon from '@/components/ButtonIcon.vue'

const props = withDefaults(
  defineProps<{
    rating: number
    disabled?: boolean
  }>(),
  {
    rating: 0,
    boolean: false
  }
)

const emit = defineEmits<{
  increase: []
  decrease: []
}>()

const handlePlusClick = () => {
  if (!props.disabled) {
    emit('increase')
  }
}

const handleMinusClick = () => {
  if (!props.disabled) {
    emit('decrease')
  }
}
</script>

<template>
  <div class="rating-wrapper">
    <button class="primary-inverse flat-btn" :disabled="disabled" @click="handlePlusClick">
      <ButtonIcon type="plus" />
    </button>
    <span class="counter">{{ rating }}</span>
    <button class="primary-inverse flat-btn" :disabled="disabled" @click="handleMinusClick">
      <ButtonIcon type="minus" />
    </button>
  </div>
</template>

<style lang="scss" scoped>
@mixin counter-block {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 5px;
}
.rating-wrapper {
  display: inline-flex;
  align-items: center;
  color: $color-primary;
  background-color: $neutral-400;
  border-radius: 10px;
  font-weight: 500;
  overflow: hidden;

  .counter {
    @include counter-block;

    font-weight: 500;
    min-height: 30px;
    @media screen and (min-width: $bp-medium) {
      min-width: 42px;
    }
  }

  button {
    @include counter-block;

    font-size: 20px;
    font-weight: 700;
    min-width: 30px;
    min-height: 30px;
  }

  @media screen and (min-width: $bp-medium) {
    flex-direction: column;
  }
}
</style>
