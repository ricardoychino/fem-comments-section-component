<script setup lang="ts">
import { ref } from 'vue'
import UserAvatar from '@/components/UserAvatar.vue'
import AutoHeightTextArea from '@/components/AutoHeightTextArea.vue'

import type { User } from '@/types/Comments'

const props = withDefaults(
  defineProps<{
    value?: string
    submitButtonText?: string
  }>(),
  {
    value: '',
    submitButtonText: 'Send'
  }
)

defineEmits<{
  submitted: [message: string]
}>()

const message = ref<string>(props.value)

const userInfo: User = {
  username: 'juliusomo',
  image: {
    png: './images/avatars/image-juliusomo.png',
    webp: './images/avatars/image-juliusomo.webp'
  }
}
</script>

<template>
  <div class="card">
    <form class="new-comment-form" @submit.prevent="$emit('submitted', message)">
      <UserAvatar class="user-picture" :url="userInfo.image.png" :username="userInfo.username" />

      <AutoHeightTextArea
        class="text-field"
        placeholder="Add a comment..."
        rows="4"
        v-model="message"
      />

      <button type="submit" class="primary">{{ submitButtonText }}</button>
    </form>
  </div>
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

  button[type='submit'] {
    grid-area: button;
    align-self: start;
  }

  @media screen and (min-width: $bp-medium) {
    grid-template-columns: min-content auto min-content;
    grid-template-areas: 'avatar textarea button';
  }
}
</style>
