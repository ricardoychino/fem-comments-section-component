<script setup lang="ts">
import { computed, ref } from 'vue'
import CommentItemHeader from '@/components/CommentItemHeader.vue'
import CommentItemRatings from '@/components/CommentItemRatings.vue'
import CommentItemReplies from '@/components/CommentItemReplies.vue'
import CommentFormNew from '@/components/CommentFormNew.vue'
import CommentFormEdit from '@/components/CommentFormEdit.vue'
import ButtonIcon from '@/components/ButtonIcon.vue'

import { useLoggedUserStore } from '@/stores/loggedUser'
import { storeToRefs } from 'pinia'

import type { Comment } from '@/types/Comments'

const props = defineProps<{
  data: Comment
}>()

const isEditing = ref<boolean>(false)
const isReplying = ref<boolean>(false)

const store = useLoggedUserStore()
const { loggedUser } = storeToRefs(store)

const isSelf = computed(() => props.data.user.username === loggedUser.value?.username)
</script>

<template>
  <div class="comment-item">
    <div class="card comment-container" :class="{ 'is-editing': isEditing }">
      <CommentItemHeader class="comment-header" :user="data.user" v-bind:isSelf />

      <CommentItemRatings class="comment-rating" :rating="data.score" />

      <div class="comment-body">
        <p v-if="!isEditing">{{ data.content }}</p>
        <CommentFormEdit :value="data.content" v-else @cancel="isEditing = false" />
      </div>

      <div class="comment-actions">
        <button class="danger flat-btn" v-if="isSelf"><ButtonIcon type="delete" />Delete</button>
        <button class="primary flat-btn" v-if="isSelf" @click="isEditing = true">
          <ButtonIcon type="edit" />Edit
        </button>
        <button class="primary flat-btn" v-if="!isSelf" @click="isReplying = true">
          <ButtonIcon type="reply" />Reply
        </button>
      </div>
    </div>

    <Transition name="slide-up">
      <div class="card reply-form" v-if="isReplying">
        <CommentFormNew :showCancelButton="true" @cancel="isReplying = false" />
      </div>
    </Transition>

    <CommentItemReplies v-if="data.replies">
      <CommentItem v-for="comment in data.replies" :data="comment" :key="comment.id" />
    </CommentItemReplies>
  </div>
</template>

<style lang="scss" scoped>
.comment-container {
  display: grid;
  grid-template-rows: auto;
  gap: 20px;
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
    place-self: start;
  }
  .comment-actions {
    grid-area: actions;
    justify-self: end;
  }

  &.is-editing {
    @media screen and (max-width: $bp-medium - 1) {
      .comment-rating,
      .comment-actions {
        display: none;
      }
    }
  }

  @include medium-screen {
    grid-template-columns: 40px auto min-content;
    grid-template-areas:
      'rating heading heading actions'
      'rating body body body';
  }
}

.reply-form {
  margin-top: -15px;
}
</style>
