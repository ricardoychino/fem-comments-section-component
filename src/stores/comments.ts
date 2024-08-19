import { ref, computed } from 'vue'
import { defineStore, storeToRefs } from 'pinia'
import { useLoggedUserStore } from './loggedUser'

import type { Comment } from '@/types/Comments'

/* Mock up */
import { useFakeBackend } from '@/composables/useFakeBackend'
const { response, insertComment, castVote } = useFakeBackend()
/* ./Mock up */

export const useCommentsStore = defineStore('comments', () => {

  // We need the current logged user to save the interactions
  const userStore = useLoggedUserStore()
  const { loggedUser: user } = storeToRefs(userStore)

  // States
  const comments = ref<Comment[]>(response.value || [])

  // Actions
  const addComment = async (text: string) => {
    try {
      if (!user.value) {
        throw new Error('user is empty')
      }

      const body = {
        content: text,
        user: user.value
      }

      const response = await insertComment(body)

      return response.message
    } catch (err) {
      return (err instanceof Error ? err.message : err)
    }
  }
  const upvoteComment = async (commentId: number) => {
    try {
      if (!user.value) {
        throw new Error('user is empty')
      }

      const response = await castVote({commentId, user: user.value.username, type: 'sum'})

      return response.message
    } catch (err) {
      return (err instanceof Error ? err.message : err)
    }
  }
  const downvoteComment = async (commentId: number) => {
    try {
      if (!user.value) {
        throw new Error('user is empty')
      }

      const response = await castVote({commentId, user: user.value.username, type: 'sub'})

      return response.message
    } catch (err) {
      return (err instanceof Error ? err.message : err)
    }
  }

  return {
    comments,
    addComment,
    upvoteComment,
    downvoteComment
  }
})
