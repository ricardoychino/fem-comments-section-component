<script setup lang="ts">
import { ref } from 'vue'
import AutoHeightTextArea from '@/components/AutoHeightTextArea.vue'
import ButtonWithLoading from '@/components/ButtonWithLoading.vue'

const props = withDefaults(
  defineProps<{
    value?: string
    submitButtonText?: string
  }>(),
  {
    value: '',
    submitButtonText: 'Update'
  }
)

const emit = defineEmits<{
  submitted: [message: string]
  cancel: []
}>()

const message = ref<string>(props.value)
const isLoading = ref(false)

const handleSubmit = () => {
  if (!isLoading.value) {
    emit('submitted', message.value)
    isLoading.value = true
  }
}

const resetState = () => {
  isLoading.value = false
}
const resetMessage = () => {
  message.value = props.value
}

defineExpose({ resetState, resetMessage })
</script>

<template>
  <form class="update-comment-form" @submit.prevent="handleSubmit">
    <AutoHeightTextArea
      class="text-field"
      placeholder="Add a comment..."
      rows="4"
      v-model="message"
    />

    <div>
      <button type="button" class="neutral flat-btn" @click="$emit('cancel')">Cancel</button>
      <ButtonWithLoading type="submit" class="primary" v-bind:isLoading>
        {{ submitButtonText }}
      </ButtonWithLoading>
    </div>
  </form>
</template>

<style lang="scss" scoped>
.update-comment-form {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 20px;
}
</style>
