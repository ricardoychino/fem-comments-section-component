<script setup lang="ts">
import { ref } from 'vue'
import UserAvatar from '@/components/UserAvatar.vue'
import AutoHeightTextArea from '@/components/AutoHeightTextArea.vue'

import { useLoggedUserStore } from '@/stores/loggedUser'
import { storeToRefs } from 'pinia'

const props = withDefaults(
  defineProps<{
    value?: string
    submitButtonText?: string
    showCancelButton?: boolean
  }>(),
  {
    value: '',
    submitButtonText: 'Send',
    showCancelButton: false
  }
)

defineEmits<{
  submitted: [message: string]
  cancel: []
}>()

const message = ref<string>(props.value)

const resetMessage = () => {
  message.value = ''
}

const store = useLoggedUserStore()
const { loggedUser: userInfo } = storeToRefs(store)

defineExpose({ resetMessage })
</script>

<template>
  <form class="new-comment-form" @submit.prevent="$emit('submitted', message)">
    <UserAvatar
      class="user-picture"
      :url="userInfo?.image.png || ''"
      :username="userInfo?.username"
    />

    <AutoHeightTextArea
      class="text-field"
      placeholder="Add a comment..."
      rows="4"
      v-model="message"
    />
    <div class="form-actions">
      <button type="submit" class="primary">{{ submitButtonText }}</button>
      <button
        v-if="showCancelButton"
        type="button"
        class="neutral flat-btn"
        @click="$emit('cancel')"
      >
        Cancel
      </button>
    </div>
  </form>
</template>

<style lang="scss" scoped>
.new-comment-form {
  display: grid;
  gap: 20px;
  grid-template-columns: 1fr;
  grid-template-rows: auto;
  grid-template-areas:
    'textarea textarea'
    'avatar button';

  .user-picture {
    grid-area: avatar;
  }

  .text-field {
    grid-area: textarea;
    place-self: stretch;
  }

  .form-actions {
    grid-area: button;
    align-self: start;
    display: flex;
    flex-direction: row-reverse;
    gap: 10px;

    @include medium-screen {
      flex-direction: column;
    }
  }

  @include medium-screen {
    grid-template-columns: min-content auto min-content;
    grid-template-areas: 'avatar textarea button';
  }
}
</style>
