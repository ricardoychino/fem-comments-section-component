<script setup lang="ts">
import { computed, ref } from 'vue'

import CommentItemLayout from '@/components/CommentItemLayout.vue'
import CommentItemHeader from '@/components/CommentItemHeader.vue'
import CommentItemRatings from '@/components/CommentItemRatings.vue'
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

const { setItemToRemove, replyComment, editComment, upvoteComment, downvoteComment } =
  useCommentsStore()
const userStore = useLoggedUserStore()
const { loggedUser } = storeToRefs(userStore)

const isEditing = ref<boolean>(false)

const isSelf = computed(() => props.data.user?.username === loggedUser.value?.username)

// Edit own comment
const editCommentForm = ref<InstanceType<typeof CommentFormEdit> | null>(null)
const handleEditFormSubmit = async (id: number, text: string) => {
  const res = await editComment(id, text)

  if (res && res.status === 200) {
    isEditing.value = false
    editCommentForm.value?.resetMessage()
  }
}

// Reply Logic
const isReplying = ref<boolean>(false)

const handleReplySubmit = async (message: string) => {
  const res = await replyComment(props.data.id, message)
  if (res && res.status === 200) {
    isReplying.value = false
  }
}
</script>

<template>
  <CommentItemLayout :class="{ 'is-editing': isEditing }">
    <template #header>
      <CommentItemHeader :user="data.user" v-bind:isSelf />
    </template>

    <template #aside-left>
      <CommentItemRatings
        :rating="data.score"
        @increase="() => upvoteComment(data.id)"
        @decrease="() => downvoteComment(data.id)"
      />
    </template>

    <template #default>
      <p v-if="!isEditing">{{ data.content }}</p>
      <CommentFormEdit
        v-else
        ref="editCommentForm"
        :value="data.content"
        @submitted="(text) => handleEditFormSubmit(data.id, text)"
        @cancel="isEditing = false"
      />
    </template>

    <template #actions>
      <button class="danger flat-btn" v-if="isSelf" @click="setItemToRemove(data.id)">
        <ButtonIcon type="delete" />Delete
      </button>
      <button class="primary flat-btn" v-if="isSelf" @click="isEditing = true">
        <ButtonIcon type="edit" />Edit
      </button>
      <button class="primary flat-btn" v-if="!isSelf" @click="isReplying = true">
        <ButtonIcon type="reply" />Reply
      </button>
    </template>
  </CommentItemLayout>

  <Transition name="slide-up">
    <div class="card reply-form" v-if="isReplying">
      <CommentFormNew
        :showCancelButton="true"
        @submitted="handleReplySubmit"
        @cancel="isReplying = false"
      />
    </div>
  </Transition>
</template>

<style lang="scss" scoped>
.is-editing {
  @media screen and (max-width: $bp-medium - 1) {
    .comment-rating,
    .comment-actions {
      display: none;
    }
  }
}

.reply-form {
  margin-top: -15px;
}
</style>
