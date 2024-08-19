import { ref, computed, watch } from 'vue'
import { defineStore, storeToRefs } from 'pinia'
import { useLoggedUserStore } from './loggedUser'

import type { Comment } from '@/types/Comments'
import type { ApiResponse } from '@/types/Requests'

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
  const addComment = async (text: string): ApiResponse<Comment> => {
    try {
      if (!user.value) {
        throw new Error('user is empty')
      }

      const body = {
        content: text,
        user: user.value
      }

      const response = await insertComment(body)

      if (response.data) {
        comments.value.push(response.data)
        internalCache.value.set(response.data.id, response.data)
      }

      return response
    } catch (err) {
      return (err instanceof Error ? err.message : err)
    }
  }
  const upvoteComment = async (commentId: number): ApiResponse<undefined> => {
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
  const downvoteComment = async (commentId: number): ApiResponse<undefined> => {
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

  // Populate internal cache for faster UI updates
  const internalCache = ref<Map<number, Comment>>(new Map())
  const updateInternalCache = (arr: Comment[]) => {
    for (const comment of arr) {
      internalCache.value.set(comment.id, comment)

      if (comment.replies && comment.replies.length > 0) {
        updateInternalCache(comment.replies)
      }
    }
  }
  watch(comments, (newValue) => {
    updateInternalCache(newValue)
  }, { immediate: true })


  return {
    comments,
    addComment,
    upvoteComment,
    downvoteComment
  }
})
