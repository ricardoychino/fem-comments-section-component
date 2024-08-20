<script setup lang="ts">
import { computed } from 'vue'
import ModalBase from '@/components/ModalBase.vue'

import { useCommentsStore } from '@/stores/comments'
import { storeToRefs } from 'pinia'

const store = useCommentsStore()
const { itemToRemove } = storeToRefs(store)
const { setItemToRemove, removeComment } = store

const isOpen = computed({
  get() {
    return itemToRemove.value !== null
  },
  set(newValue) {
    if (!newValue) {
      setItemToRemove(null)
    }
  }
})

const emit = defineEmits<{
  confirm: []
  close: []
}>()

const handleConfirm = async () => {
  const res = await removeComment()

  if (res.status === 200) {
    isOpen.value = false
  }
}
const handleCancel = () => {
  isOpen.value = false
  emit('close')
}
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
