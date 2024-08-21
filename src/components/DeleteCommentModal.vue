<script setup lang="ts">
import { ref, computed } from 'vue'
import ModalBase from '@/components/ModalBase.vue'
import ButtonWithLoading from '@/components/ButtonWithLoading.vue'

import { useCommentsStore } from '@/stores/comments'
import { storeToRefs } from 'pinia'

const store = useCommentsStore()
const { itemToRemove } = storeToRefs(store)
const { setItemToRemove, removeComment } = store

const emit = defineEmits<{
  confirm: []
  close: []
}>()

const isLoading = ref(false)

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

const handleConfirm = async () => {
  if (!isLoading.value) {
    isLoading.value = true
    const res = await removeComment()

    if (res.status === 200) {
      isOpen.value = false
      isLoading.value = false
    }
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
        <ButtonWithLoading class="danger" v-bind:isLoading @click="handleConfirm">
          Yes, delete
        </ButtonWithLoading>
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
