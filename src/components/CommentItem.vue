<script setup lang="ts">
import { computed, ref } from 'vue'
import CommentItemHeader from '@/components/CommentItemHeader.vue'
import CommentItemRatings from '@/components/CommentItemRatings.vue'
import CommentItemReplies from '@/components/CommentItemReplies.vue'
import CommentFormNew from '@/components/CommentFormNew.vue'
import CommentFormEdit from '@/components/CommentFormEdit.vue'
import ButtonIcon from '@/components/ButtonIcon.vue'

import { useLoggedUserStore } from '@/stores/loggedUser'
import { useCommentsStore } from '@/stores/comments'
import { storeToRefs } from 'pinia'

import type { Comment } from '@/types/Comments'

const props = defineProps<{
  data: Comment
}>()

const isEditing = ref<boolean>(false)
const isReplying = ref<boolean>(false)

const userStore = useLoggedUserStore()
const { loggedUser } = storeToRefs(userStore)

const { setItemToRemove, replyComment, editComment, upvoteComment, downvoteComment } =
  useCommentsStore()

const isSelf = computed(() => props.data.user.username === loggedUser.value?.username)

// Edit own comment
const editCommentForm = ref<InstanceType<typeof CommentFormEdit> | null>(null)
const handleEditFormSubmit = async (id: number, text: string) => {
  const res = await editComment(id, text)

  if (res && res.status === 200) {
    isEditing.value = false
    editCommentForm.value?.resetMessage()
  }
}

// Reply some comment
const handleReplySubmit = async (message: string) => {
  const res = await replyComment(props.data.id, message)
  if (res && res.status === 200) {
    isReplying.value = false
  }
}
</script>

<template>
  <div class="comment-item">
    <div class="card comment-container" :class="{ 'is-editing': isEditing }">
      <CommentItemHeader class="comment-header" :user="data.user" v-bind:isSelf />

      <CommentItemRatings
        class="comment-rating"
        :rating="data.score"
        @increase="() => upvoteComment(data.id)"
        @decrease="() => downvoteComment(data.id)"
      />

      <div class="comment-body">
        <p v-if="!isEditing">{{ data.content }}</p>
        <CommentFormEdit
          v-else
          ref="editCommentForm"
          :value="data.content"
          @submitted="(text) => handleEditFormSubmit(data.id, text)"
          @cancel="isEditing = false"
        />
      </div>

      <div class="comment-actions">
        <button class="danger flat-btn" v-if="isSelf" @click="setItemToRemove(data.id)">
          <ButtonIcon type="delete" />Delete
        </button>
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
        <CommentFormNew
          :showCancelButton="true"
          @submitted="handleReplySubmit"
          @cancel="isReplying = false"
        />
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
