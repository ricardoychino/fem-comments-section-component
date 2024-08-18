import initial from '@/mock/comments.json'
import { computed, ref, type Ref } from 'vue'

import type { Comment } from '@/types/Comments'

type StorageComment = Map<number, Comment>    // ID - Comment
type StorageReplies = Map<number, number[]>   // commentId => replyCommentsId[]
type StorageVotes = Set<string>               // Pair `{username}-{commentId}`

type Storage = {
  list: Ref<number[]>,
  comments: Ref<StorageComment>,
  replies: Ref<StorageReplies>,
  votes: Ref<StorageVotes>,
}


const createStorageFromArray = (data: Comment[], storage: Storage, currentParent: number = 0) => {
  for (const item of data) {

    if (currentParent) {
      storage.replies.value.set(currentParent, [...(storage.replies.value.get(currentParent) || []), item.id])
    } else {
      storage.list.value.push(item.id)
    }

    if (item.replies && item.replies.length > 0) {
      createStorageFromArray(item.replies, storage, item.id)
      delete item.replies
    }

    storage.comments.value.set(item.id, item)
  }
}

export const useFakeBackend = () => {
  const storageComment = ref<StorageComment>(new Map())
  const storageReplies = ref<StorageReplies>(new Map())
  const storageVotes = ref<StorageVotes>(new Set())
  const responseList = ref<number[]>([])

  const storage = {
    list: responseList,
    comments: storageComment,
    replies: storageReplies,
    votes: storageVotes
  }

  const response = computed(() => {
    const res: Comment[] = []

    for (const id of storage.list.value) {
      const entry = storage.comments.value.get(id) as Comment

      if (storage.replies.value.has(id)) {
        entry.replies = storage.replies.value.get(id)!.map(el => storage.comments.value.get(+el) as Comment)
      }

      res.push(entry)
    }

    return res
  })



  const updateLocalStorage = () => {
    localStorage.setItem('list-data', JSON.stringify([...storage.list.value]))
    localStorage.setItem('comments-data', JSON.stringify([...storage.comments.value.entries()]))
    localStorage.setItem('replies-data', JSON.stringify([...storage.replies.value.entries()]))
    localStorage.setItem('votes-data', JSON.stringify([...storage.votes.value]))
  }

  const initialize = () => {
    const fromLocalStorage = {
      list: localStorage.getItem('list-data'),
      comments: localStorage.getItem('comments-data'),
      replies: localStorage.getItem('replies-data'),
      votes: localStorage.getItem('votes-data')
    }
    if (!fromLocalStorage.list || !fromLocalStorage.comments || !fromLocalStorage.replies || !fromLocalStorage.votes) {
      createStorageFromArray(initial, storage)

      updateLocalStorage()
    } else {
      storage.list.value = [...(JSON.parse(fromLocalStorage.list))]
      JSON.parse(fromLocalStorage.comments).forEach(([key, value]: [number, Comment]) => storage.comments.value.set(+key, value));
      JSON.parse(fromLocalStorage.replies).forEach(([key, value]: [number, number[]]) => storage.replies.value.set(+key, value));
      [...(JSON.parse(fromLocalStorage.votes))].forEach(val => storage.votes.value.add(val))
    }
  }

  initialize()

  return { response }
}