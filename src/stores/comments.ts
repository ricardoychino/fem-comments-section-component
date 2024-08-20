import { ref, watch } from 'vue'
import { defineStore, storeToRefs } from 'pinia'
import { useLoggedUserStore } from './loggedUser'
import { useTooltipsStore } from './tooltips'

import type { Comment } from '@/types/Comments'
import type { ApiResponse, Data } from '@/types/Requests'

/* Mock up */
import { useFakeBackend } from '@/composables/useFakeBackend'
const { response, postComment, patchComment, deleteComment, castVote } = useFakeBackend()
/* ./Mock up */

type RequestResp = Promise<ApiResponse<Data<Comment> | Comment> | unknown>

export const useCommentsStore = defineStore('comments', () => {

  // We need the current logged user to save the interactions
  const userStore = useLoggedUserStore()
  const { loggedUser: user } = storeToRefs(userStore)

  const { append } = useTooltipsStore()
  const appendSuccessTooltip = (text: string) => { append('success', text, { duration: 5000, closable: true }) }
  const appendErrorTooltip = (text: string) => { append('danger', text, { duration: 5000, closable: true }) }

  // States
  const comments = ref<Comment[]>(response.value || [])
  const itemToRemove = ref<number | null>(null)

  // Actions
  const setItemToRemove = (id: number | null) => {
    itemToRemove.value = id
  }
  const addComment = async (text: string, replyingTo?: number): RequestResp => {
    try {
      if (!user.value) {
        throw new Error('The user is not defined')
      }

      const body: Partial<Omit<Comment, 'id'>> = {
        content: text,
        user: user.value
      }

      if (typeof replyingTo !== 'undefined') {
        body.replyingTo = replyingTo
      }

      const response = await postComment(body)

      if (response.data) {
        internalCache.value.set(response.data.row.id, response.data.row)

        // Add to the main queue => only triggers when not a reply
        if (typeof replyingTo === 'undefined') {
          comments.value.push(response.data.row)
        }
      }
      appendSuccessTooltip(response.message)

      return response
    } catch (err) {
      const errorMessage: string = (err instanceof Error ? err.message : '')

      appendErrorTooltip(errorMessage)

      return err
    }
  }
  const replyComment = async (replyTo: number, text: string): RequestResp => {
    const resp = await addComment(text, replyTo) as ApiResponse<Data<Comment>>

    if (resp.status === 200) {
      const { row, pos, parent } = resp.data as Data<Comment>

      const pointer = internalCache.value.get(row.id) as Comment
      const parentPointer = internalCache.value.get(parent)

      if (parentPointer && !parentPointer?.replies) parentPointer.replies = [pointer]
      else {
        parentPointer?.replies?.splice(pos, 0, pointer)
      }
    }
    return resp
  }
  const editComment = async (id: number, text: string): RequestResp => {
    try {
      if (!user.value) {
        throw new Error('The user is not defined')
      }

      const theComment = internalCache.value.get(id)
      if (user.value.username !== theComment?.user?.username) {
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
  const removeComment = async (): RequestResp => {
    try {
      const id = itemToRemove.value

      if (!id) {
        throw new Error('Something went wrong')
      }

      if (!user.value) {
        throw new Error('The user is not defined')
      }

      const theComment = internalCache.value.get(id)
      if (user.value.username !== theComment?.user?.username) {
        throw new Error('Action not allowed!')
      }

      const body = {
        id
      }

      const response = await deleteComment(body)

      console.log(response.data)

      if (response.data) {
        if (response.data.row) {
          theComment.content = response.data.row.content
          theComment.user = null
          theComment.removed = response.data.row.removed
          theComment.score = 0
        } else {
          if (response.data.parent >= 0) {
            const parent = internalCache.value.get(response.data.parent)
            parent?.replies?.splice(response.data.pos, 1)
          } else {
            comments.value.splice(response.data.pos, 1)
            console.log(comments.value)
          }
          internalCache.value.delete(id)
        }
      }
      appendSuccessTooltip(response.message)

      return response
    } catch (err) {
      const errorMessage: string = (err instanceof Error ? err.message : '')

      appendErrorTooltip(errorMessage)
    }
  }
  const upvoteComment = async (commentId: number): RequestResp => {
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
  const downvoteComment = async (commentId: number): RequestResp => {
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
    itemToRemove,
    setItemToRemove,
    addComment,
    replyComment,
    editComment,
    removeComment,
    upvoteComment,
    downvoteComment
  }
})
