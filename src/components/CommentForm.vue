<script setup lang="ts">
import { ref } from 'vue'
import AutoHeightTextArea from '@/components/AutoHeightTextArea.vue'

import type { User } from '@/types/Comments'

withDefaults(
  defineProps<{
    submitButtonText?: string
  }>(),
  {
    submitButtonText: 'Send'
  }
)

defineEmits<{
  submitted: [message: string]
}>()

const message = ref<string>('')

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
    <form class="reply-form" @submit.prevent="$emit('submitted', message)">
      <figure class="user-picture">
        <img :src="userInfo.image.png" :alt="`${userInfo.username} avatar`" />
      </figure>

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
.reply-form {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 20px;

  .user-picture {
    order: 2;
    height: 40px;
    width: 40px;
    overflow: hidden;
    border-radius: 50%;

    img {
      max-width: 100%;
      max-height: 100%;
      object-fit: cover;
      object-position: center;
    }
  }

  .text-field {
    flex: 1 0 100%;
  }

  button[type='submit'] {
    order: 3;
  }

  @media screen and (min-width: $bp-medium) {
    flex-wrap: nowrap;

    .user-picture {
      order: 1;
    }
    .text-field {
      order: 2;
      flex-basis: 0;
    }
    button[type='submit'] {
      align-self: flex-start;
    }
  }
}
</style>
