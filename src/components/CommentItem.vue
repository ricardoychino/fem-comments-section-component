<script setup lang="ts">
import CommentItemLayout from '@/components/CommentItemLayout.vue'
import CommentItemDisplay from '@/components/CommentItemDisplay.vue'
import CommentItemReplies from '@/components/CommentItemReplies.vue'

import CommentItemHeader from '@/components/CommentItemHeader.vue'

import type { Comment } from '@/types/Comments'

defineProps<{
  data: Comment
}>()
</script>

<template>
  <div class="comment-item">
    <div class="comment-wrapper">
      <CommentItemLayout v-if="data.removed" class="removed-comment">
        <template #header>
          <CommentItemHeader :isSelf="false" :user="null" />
        </template>
        <p><em>This comment has ben removed by the author</em></p>
      </CommentItemLayout>

      <CommentItemDisplay v-else v-bind:data />
    </div>

    <CommentItemReplies v-if="data.replies">
      <CommentItem v-for="comment in data.replies" :data="comment" :key="comment.id" />
    </CommentItemReplies>
  </div>
</template>

<style lang="scss" scoped>
.removed-comment {
  p {
    opacity: 0.5;
  }
}
</style>
