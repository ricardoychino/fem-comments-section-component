import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

import type { User } from '@/types/Comments.d.ts'

interface LoginData {
  username: string,
  password: string
}

export const useLoggedUserStore = defineStore('loggedUser', () => {
  const loggedUser = ref<User | null>(null)

  const userLogin = async ({ username, password }: LoginData) => {
    const res = await fetch(`/src/mock/user-${username}-${password}.json`)
    const data = await res.json()

    loggedUser.value = data
  }

  return { loggedUser, userLogin }
})
