import initial from '@/../public/mock/comments.json'
import { computed, ref } from 'vue'

import type { Ref } from 'vue'
import type { Comment } from '@/types/Comments'
import type { ApiResponse, Data } from '@/types/Requests'

type StorageComment = Map<number, Comment>    // ID - Comment
type StorageReplies = Map<number, number[]>   // commentId => replyCommentsId[]
type StorageResponses = Map<number, number>   // replyId => commentId
type StorageVotes = Set<string>               // Pair `{username}-{commentId}`

type Storage = {
  list: Ref<number[]>,
  comments: Ref<StorageComment>,
  replies: Ref<StorageReplies>,
  responses: Ref<StorageResponses>,
  votes: Ref<StorageVotes>,
}

interface CastVoteArgs {
  commentId: number,
  user: string,
  type: 'sum' | 'sub'
}

type PostCommentFn = (arg0: Partial<Omit<Comment, 'id'>>) => Promise<ApiResponse<Data<Comment>>>
type PatchCommentFn = (arg0: Pick<Comment, 'content' | 'id'>) => Promise<ApiResponse<Comment>>
type DeleteCommentFn = (arg0: { id: number }) => Promise<ApiResponse<Data<Comment>>>
type CastVoteFn = (arg0: CastVoteArgs) => Promise<ApiResponse<unknown>>


const createStorageFromArray = (data: Comment[], storage: Storage, currentParent: number = 0) => {
  for (const item of data) {

    if (currentParent) {
      storage.replies.value.set(currentParent, [...(storage.replies.value.get(currentParent) || []), item.id])
      storage.responses.value.set(item.id, currentParent)
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
  const storageResponses = ref<StorageResponses>(new Map())
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
        responses: storageResponses,
        votes: storageVotes
      }

      createStorageFromArray(initial, storage)

      updateLocalStorage()
    } else {
      responseList.value = [...(JSON.parse(fromLocalStorage.list))]
      JSON.parse(fromLocalStorage.comments).forEach(([key, value]: [number, Comment]) => storageComment.value.set(+key, value));
      JSON.parse(fromLocalStorage.replies).forEach(([key, value]: [number, number[]]) => {
        storageReplies.value.set(+key, value)
        value.forEach(val => storageResponses.value.set(val, +key))
      });
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
  const postComment: PostCommentFn = async ({ replyingTo, content, user }) => {
    return request<Data<Comment>>(() => {
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

      let message = `Comment #${newRow.id} added successfully!`
      const data: Data<Comment> = {row: newRow, pos: -1, parent: -1}

      if (replyingTo && !isNaN(+replyingTo)) {
        let parent = storageResponses.value.get(+replyingTo)

        // Check if the comment we are replying is a "child" | sibling comment
        if (!parent) {
          parent = +replyingTo
        }

        const allReplies = storageReplies.value.get(parent) || []
        let pos = 0

        // If it is already the parent, just append at the end of the array of replies
        if (parent === replyingTo) {
          pos = (allReplies?.length || 1) - 1
        }
        // Case contrary we need to insert between the messages
        else {
          pos = allReplies?.indexOf(+replyingTo) || 0
        }

        // storageReplies.value.set(parent, [...(storageReplies.value.get(parent) || []), nextCommentId.value])

        allReplies?.splice(pos + 1, 0, nextCommentId.value)
        storageReplies.value.set(parent, allReplies!)
        storageResponses.value.set(nextCommentId.value, parent)

        message = `Replied successfully`
        data.parent = parent
        data.pos = pos + 1
      } else {
        responseList.value.push(nextCommentId.value)
      }

      updateLocalStorage()

      nextCommentId.value++

      return {
        status: 200,
        data,
        message
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
  const deleteComment: DeleteCommentFn = async ({ id }) => {
    return request<Data<Comment>>(() => {
      if (!id) {
        throw new Error('Missing identifier')
      }

      const entry = storageComment.value.get(id)

      if (!entry || entry.removed) {
        return {
          status: 304,
          message: 'Nothing removed'
        }
      }
      let parent = -1
      let pos = -1
      let removed

      // If there's no 'children', just remove from everywhere
      if (!storageReplies.value.has(id)) {
        storageComment.value.delete(id)

        parent = -1
        pos = responseList.value.indexOf(id)

        // If found, means it is from "parent" list
        if (pos >= 0) {
          responseList.value.splice(pos, 1)
        } else {
          parent = storageResponses.value.get(id) || -1
          storageResponses.value.delete(id)
          const parentList = storageReplies.value.get(parent)

          pos = parentList?.indexOf(id) as number
          if (pos >= 0) {
            parentList?.splice(pos, 1)
          }
        }
      }
      // Case contrary, empty the original comment to not break the flow of comments
      else {
        removed = {
          ...entry,
          removed: true,
          content: '',
          user: null
        }
        storageComment.value.set(id, removed)
      }

      updateLocalStorage()

      return {
        status: 200,
        data: {
          row: removed,
          pos,
          parent
        },
        message: `Comment removed successfully!`
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
      if (entry?.user?.username === user) throw new Error('You can\'t vote on your own comment!')

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

  return { response, postComment, patchComment, deleteComment, castVote }
}