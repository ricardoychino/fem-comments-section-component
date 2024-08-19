import initial from '@/mock/comments.json'
import { computed, ref } from 'vue'

import type { Ref } from 'vue'
import type { Comment } from '@/types/Comments'
import type { ApiResponse } from '@/types/Requests'

type StorageComment = Map<number, Comment>    // ID - Comment
type StorageReplies = Map<number, number[]>   // commentId => replyCommentsId[]
type StorageVotes = Set<string>               // Pair `{username}-{commentId}`

type Storage = {
  list: Ref<number[]>,
  comments: Ref<StorageComment>,
  replies: Ref<StorageReplies>,
  votes: Ref<StorageVotes>,
}

interface CastVoteArgs {
  commentId: number,
  user: string,
  type: 'sum' | 'sub'
}

type InsertCommentFn = (arg0: Pick<Comment, 'content' | 'user'>) => Promise<ApiResponse<Comment>>
type PatchCommentFn = (arg0: Pick<Comment, 'content' | 'id'>) => Promise<ApiResponse<Comment>>
type CastVoteFn = (arg0: CastVoteArgs) => Promise<ApiResponse<unknown>>


const createStorageFromArray = (data: Comment[], storage: Storage, currentParent: number = 0) => {
  for (const item of data) {

    if (currentParent) {
      storage.replies.value.set(currentParent, [...(storage.replies.value.get(currentParent) || []), item.id])
    } else {
      storage.list.value.push(item.id)
    }

    if (item.replies && item.replies.length > 0) {
      createStorageFromArray(item.replies, storage, item.id)
    }

    if (item.replies) {
      delete item.replies
    }
    if (item.replyingTo) {
      delete item.replyingTo
    }

    storage.comments.value.set(item.id, item)
  }
}

export const useFakeBackend = () => {
  const nextCommentId = ref(0)
  const storageComment = ref<StorageComment>(new Map())
  const storageReplies = ref<StorageReplies>(new Map())
  const storageVotes = ref<StorageVotes>(new Set())
  const responseList = ref<number[]>([])

  // State

  // Getter
  const response = computed(() => {
    const res: Comment[] = []

    for (const id of responseList.value) {
      const entry = storageComment.value.get(id) as Comment

      if (storageReplies.value.has(id)) {
        entry.replies = storageReplies.value.get(id)!.map(el => storageComment.value.get(+el) as Comment)
      }

      res.push(entry)
    }

    return res
  })

  // Actions - local
  const updateLocalStorage = () => {
    localStorage.setItem('list-data', JSON.stringify([...responseList.value]))
    localStorage.setItem('comments-data', JSON.stringify([...storageComment.value.entries()]))
    localStorage.setItem('replies-data', JSON.stringify([...storageReplies.value.entries()]))
    localStorage.setItem('votes-data', JSON.stringify([...storageVotes.value]))
  }
  const initialize = () => {
    const fromLocalStorage = {
      list: localStorage.getItem('list-data'),
      comments: localStorage.getItem('comments-data'),
      replies: localStorage.getItem('replies-data'),
      votes: localStorage.getItem('votes-data')
    }
    if (!fromLocalStorage.list || !fromLocalStorage.comments || !fromLocalStorage.replies || !fromLocalStorage.votes) {
      const storage = {
        list: responseList,
        comments: storageComment,
        replies: storageReplies,
        votes: storageVotes
      }

      createStorageFromArray(initial, storage)

      updateLocalStorage()
    } else {
      responseList.value = [...(JSON.parse(fromLocalStorage.list))]
      JSON.parse(fromLocalStorage.comments).forEach(([key, value]: [number, Comment]) => storageComment.value.set(+key, value));
      JSON.parse(fromLocalStorage.replies).forEach(([key, value]: [number, number[]]) => storageReplies.value.set(+key, value));
      [...(JSON.parse(fromLocalStorage.votes))].forEach(val => storageVotes.value.add(val))
    }

    nextCommentId.value = Math.max(...storageComment.value.keys()) + 1
  }

  const request = async <T>(fn: Function, ...args: any[]) => {

    const randomTime = Math.floor((Math.random() * 2500) + 500)

    return new Promise<ApiResponse<T>>((resolve, reject) => {
      try {
        const res = fn(...args)

        setTimeout(() => {
          resolve(res)
        }, randomTime)
      } catch (err) {
        let errorMessage = 'REQUEST ERROR'

        if (err instanceof Error) {
          errorMessage = err.message
        }

        reject(new Error(errorMessage))
      }
    })
  }

  // Actions - perform mutations
  const insertComment: InsertCommentFn = async ({ content, user }) => {
    return request<Comment>(() => {
      if (!user) {
        throw new Error('Missing author')
      }
      if (!content || content === '') {
        throw new Error('Empty or invalid message')
      }

      const newRow: Comment = {
        id: nextCommentId.value,
        content,
        user,
        createdAt: Date.now(),
        score: 0
      }

      storageComment.value.set(nextCommentId.value, newRow)
      responseList.value.push(nextCommentId.value)

      updateLocalStorage()

      nextCommentId.value++

      return {
        status: 200,
        data: newRow,
        message: `Comment #${newRow.id} added successfully!`
      }
    })
  }
  const patchComment: PatchCommentFn = async ({ id, content }) => {
    return request<Comment>(() => {
      if (!id) {
        throw new Error('Missing identifier')
      }
      if (!content || content === '') {
        throw new Error('Empty or invalid message')
      }

      const entry = storageComment.value.get(id)

      if (!entry) {
        throw new Error('Content not found')
      }

      entry.content = content
      storageComment.value.set(id, entry)

      updateLocalStorage()

      return {
        status: 200,
        data: entry,
        message: `Comment #${id} altered successfully!`
      }
    })
  }
  const castVote: CastVoteFn = ({commentId, user, type}) => {
    return request(() => {
      const identifier = `${user}-${commentId}`

      // Do not allow to vote more than once
      if (storageVotes.value.has(identifier)) throw new Error('You already voted on this comment!')

      const entry = storageComment.value.get(commentId)

      // Check if the comment is from the same user
      if (entry?.user.username === user) throw new Error('You can\'t vote in your own comment!')

      entry!.score += (type == 'sum' ? 1 : -1)
      storageVotes.value.add(identifier)

      updateLocalStorage()

      return {
        status: 200,
        message: `Vote casted successfully`
      }
    })
  }


  // Setup
  initialize()

  return { response, insertComment, patchComment, castVote }
}