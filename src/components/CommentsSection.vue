<script setup lang="ts">
import { ref } from 'vue'
import CommentItem from '@/components/CommentItem.vue'
import CommentFormNew from '@/components/CommentFormNew.vue'
import DeleteCommentModal from '@/components/DeleteCommentModal.vue'

import { useCommentsStore } from '@/stores/comments'
import { storeToRefs } from 'pinia'

const store = useCommentsStore()
const { addComment } = store
const { comments } = storeToRefs(store)

const modalOpen = ref<boolean>(false)

const handleSubmit = (value: string) => {
  addComment(value)
}
</script>

<template>
  <div class="comments-section">
    <div class="comments-list">
      <CommentItem v-for="comment in comments" :data="comment" :key="comment.id" />
    </div>

    <div class="card">
      <CommentFormNew @submitted="handleSubmit" />
    </div>

    <DeleteCommentModal v-model="modalOpen" />
  </div>
</template>
