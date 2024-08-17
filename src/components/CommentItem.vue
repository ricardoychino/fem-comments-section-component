<script setup lang="ts">
import CommentItemHeader from '@/components/CommentItemHeader.vue'
import CommentItemRatings from '@/components/CommentItemRatings.vue'
import CommentItemReplies from '@/components/CommentItemReplies.vue'
import ButtonIcon from '@/components/ButtonIcon.vue'

import type { Comment } from '@/types/Comments'

withDefaults(
  defineProps<{
    data: Comment
    isSelf?: boolean
  }>(),
  {
    isSelf: false
  }
)
</script>

<template>
  <div class="comment-item">
    <div class="card comment-container">
      <CommentItemHeader class="comment-header" :user="data.user" v-bind:isSelf />

      <CommentItemRatings class="comment-rating" :rating="data.score" />

      <div class="comment-body">
        {{ data.content }}
      </div>

      <div class="comment-actions">
        <button class="danger flat-btn" v-if="isSelf"><ButtonIcon type="delete" />Delete</button>
        <button class="primary flat-btn" v-if="isSelf"><ButtonIcon type="edit" />Edit</button>
        <button class="primary flat-btn" v-if="!isSelf"><ButtonIcon type="reply" />Reply</button>
      </div>
    </div>
    <CommentItemReplies v-if="data.replies">
      <CommentItem
        v-for="comment in data.replies"
        :data="comment"
        :isSelf="comment.user.username === 'juliusomo'"
        :key="comment.id"
      />
    </CommentItemReplies>
  </div>
</template>

<style lang="scss" scoped>
.comment-container {
  display: grid;
  grid-template-rows: auto;
  gap: 20px;
  margin-bottom: 20px;
  grid-template-areas:
    'heading heading'
    'body body'
    'rating actions';

  .comment-header {
    grid-area: heading;
  }
  .comment-body {
    grid-area: body;
  }
  .comment-rating {
    grid-area: rating;
    justify-self: start;
  }
  .comment-actions {
    grid-area: actions;
    justify-self: end;
  }

  @media screen and (min-width: $bp-medium) {
    grid-template-columns: 40px auto min-content;
    grid-template-areas:
      'rating heading heading actions'
      'rating body body body';
  }
}
</style>
