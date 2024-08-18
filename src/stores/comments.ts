import { ref, computed, toValue } from 'vue'
import { defineStore, storeToRefs } from 'pinia'
import { useLoggedUserStore } from './loggedUser'

import type { Comment } from '@/types/Comments'

/* Mock up */
import { useFakeBackend } from '@/composables/useFakeBackend'
const { response, castVote } = useFakeBackend()
/* ./Mock up */

export const useCommentsStore = defineStore('comments', () => {

  // We need the current logged user to save the interactions
  const userStore = useLoggedUserStore()
  const { loggedUser: user } = storeToRefs(userStore)

  // States
  const comments = ref<Comment[]>(toValue(response) || [])

  // Actions
  const upvoteComment = (commentId: number) => {
    if (user.value) {
      castVote({commentId, user: user.value.username, type: 'sum'})
    }
  }
  const downvoteComment = (commentId: number) => {
    if (user.value) {
      castVote({commentId, user: user.value.username, type: 'sub'})
    }
  }

  return { comments, upvoteComment, downvoteComment }
})
