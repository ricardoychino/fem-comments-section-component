import { ref, computed, watch } from 'vue'
import { defineStore, storeToRefs } from 'pinia'
import { useLoggedUserStore } from './loggedUser'
import { useTooltipsStore } from './tooltips'

import type { Comment } from '@/types/Comments'
import type { ApiResponse } from '@/types/Requests'

/* Mock up */
import { useFakeBackend } from '@/composables/useFakeBackend'
const { response, insertComment, patchComment, castVote } = useFakeBackend()
/* ./Mock up */

export const useCommentsStore = defineStore('comments', () => {

  // We need the current logged user to save the interactions
  const userStore = useLoggedUserStore()
  const { loggedUser: user } = storeToRefs(userStore)

  const { append } = useTooltipsStore()
  const appendSuccessTooltip = (text: string) => { append('success', text, { duration: 5000, closable: true }) }
  const appendErrorTooltip = (text: string) => { append('danger', text, { duration: 5000, closable: true }) }

  // States
  const comments = ref<Comment[]>(response.value || [])

  // Actions
  const addComment = async (text: string): ApiResponse<Comment> => {
    try {
      if (!user.value) {
        throw new Error('The user is not defined')
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
      appendSuccessTooltip(response.message)

      return response
    } catch (err) {
      const errorMessage: string = (err instanceof Error ? err.message : '')

      appendErrorTooltip(errorMessage)
    }
  }
  const editComment = async (id: number, text: string): ApiResponse<Comment> => {
    try {
      if (!user.value) {
        throw new Error('The user is not defined')
      }

      const theComment = internalCache.value.get(id)
      if (user.value.username !== theComment?.user.username) {
        throw new Error('Edit action not allowed!')
      }

      const body = {
        id,
        content: text
      }

      const response = await patchComment(body)

      if (response.data) {
        theComment.content = text
      }
      appendSuccessTooltip(response.message)

      return response
    } catch (err) {
      const errorMessage: string = (err instanceof Error ? err.message : '')

      appendErrorTooltip(errorMessage)
    }
  }
  const upvoteComment = async (commentId: number): ApiResponse<undefined> => {
    try {
      if (!user.value) {
        throw new Error('user is empty')
      }

      const response = await castVote({commentId, user: user.value.username, type: 'sum'})
      appendSuccessTooltip(response.message)

      return response.message
    } catch (err) {
      const errorMessage: string = (err instanceof Error ? err.message : '')

      appendErrorTooltip(errorMessage)
    }
  }
  const downvoteComment = async (commentId: number): ApiResponse<undefined> => {
    try {
      if (!user.value) {
        throw new Error('user is empty')
      }

      const response = await castVote({commentId, user: user.value.username, type: 'sub'})
      appendSuccessTooltip(response.message)

      return response.message
    } catch (err) {
      const errorMessage: string = (err instanceof Error ? err.message : '')

      appendErrorTooltip(errorMessage)
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
    editComment,
    upvoteComment,
    downvoteComment
  }
})
