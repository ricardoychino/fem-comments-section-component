<script setup lang="ts">
import ModalBase from '@/components/ModalBase.vue'

const isOpen = defineModel<boolean>({ default: false })

const emit = defineEmits<{
  close: []
}>()

const handleCancel = () => {
  isOpen.value = false
  emit('close')
}
const handleConfirm = () => {}
</script>

<template>
  <ModalBase :hideCloseBtn="true" v-model="isOpen">
    <template #header>
      <h3>Delete comment</h3>
    </template>
    <p>
      Are you sure you want to delete this comment? This will remove the comment and can't be
      undone.
    </p>

    <template #footer>
      <div class="delete-modal-actions">
        <button class="neutral" @click="handleCancel">No, cancel</button>
        <button class="danger" @click="handleConfirm">Yes, delete</button>
      </div>
    </template>
  </ModalBase>
</template>

<style lang="scss" scoped>
.delete-modal-actions {
  display: flex;
  gap: 15px;

  button {
    flex-grow: 1;
  }
}
</style>
