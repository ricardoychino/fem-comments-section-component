<script setup lang="ts">
import ButtonIcon from '@/components/ButtonIcon.vue'

withDefaults(
  defineProps<{
    hideCloseBtn?: boolean
  }>(),
  {
    hideCloseBtn: false
  }
)

const isOpen = defineModel<boolean>({ default: false })

const emit = defineEmits<{
  close: []
}>()

const handleCloseBtn = () => {
  isOpen.value = false
  emit('close')
}
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div class="modal-wrapper" v-show="isOpen">
        <div class="modal-layer"></div>

        <div class="modal-dialog card">
          <div class="modal-header">
            <slot name="header">
              <h3>Title</h3>
            </slot>

            <button v-if="!hideCloseBtn" class="close-btn neutral flat-btn" @click="handleCloseBtn">
              <ButtonIcon type="close" />
            </button>
          </div>
          <div class="modal-body">
            <slot></slot>
          </div>
          <div class="modal-footer">
            <slot name="footer"></slot>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style lang="scss" scoped>
.full-view {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}
.modal-wrapper {
  @extend .full-view;
  display: flex;
  overflow: auto;
  padding: 30px 15px;

  .modal-layer {
    @extend .full-view;
    background-color: #{$neutral-900}b3;
  }

  .modal-dialog {
    position: relative;
    margin: auto;
    width: 400px;
    max-width: 100%;
    padding: 20px;
    transition: inherit;

    .modal-header {
      position: relative;
      display: flex;
      align-items: center;
      margin-bottom: 20px;

      & > *:not(.close-btn) {
        font-size: 1.25em;
        font-weight: 600;
        margin: 0;
      }

      .close-btn {
        margin-left: auto;
        margin-top: -20px;
        margin-right: -20px;
      }
    }
    .modal-body {
      margin-bottom: 20px;
    }
  }
}

/* Transition mixin (@/assets/css/mixins.scss) */
@include vue-transition('modal') {
  &__active {
    opacity: 1;
  }
  &__inactive {
    opacity: 0;

    .modal-dialog {
      transform: translateY(-40px);
    }
  }
  &__transition-in,
  &__transition-out {
    transition: all 0.2s linear;
  }
}
</style>
