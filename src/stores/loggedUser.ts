import { ref } from 'vue'
import { defineStore } from 'pinia'

import type { User } from '@/types/Comments.d.ts'

interface LoginData {
  username: string,
  password: string
}

export const useLoggedUserStore = defineStore('loggedUser', () => {
  const loggedUsername = localStorage.getItem('current-username') || 'juliusomo'

  const loggedUser = ref<User | null>(null)

  const userLogin = async ({ username, password }: LoginData) => {
    const res = await fetch(`/mock/user-${username}-${password}.json`)
    const data = await res.json()

    localStorage.setItem('current-username', username)

    loggedUser.value = data
  }

  if (!loggedUser.value) {
    userLogin({ username: loggedUsername, password: 'user' })
  }

  return { loggedUser, userLogin }
})
