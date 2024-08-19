<script setup lang="ts">
import { ref } from 'vue'
import AutoHeightTextArea from '@/components/AutoHeightTextArea.vue'

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

defineEmits<{
  submitted: [message: string]
  cancel: []
}>()

const message = ref<string>(props.value)

const resetMessage = () => {
  message.value = props.value
}

defineExpose({ resetMessage })
</script>

<template>
  <form class="update-comment-form" @submit.prevent="$emit('submitted', message)">
    <AutoHeightTextArea
      class="text-field"
      placeholder="Add a comment..."
      rows="4"
      v-model="message"
    />

    <div>
      <button type="button" class="neutral flat-btn" @click="$emit('cancel')">Cancel</button>
      <button type="submit" class="primary">{{ submitButtonText }}</button>
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
